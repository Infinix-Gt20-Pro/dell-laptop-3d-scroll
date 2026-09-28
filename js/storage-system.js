/**
 * Classic Computers — InsForge Storage Engine
 * ============================================
 * Handles file uploads, bucket operations, and attachment management
 * using the official InsForge Storage REST API (presigned S3 + direct strategies).
 *
 * Supported features:
 * - Direct or Presigned S3 upload strategy
 * - Confirm upload with size and mimeType
 * - Retrieval of signed or direct download URLs
 * - Storage attachment to InsForge database records (orders, enquiries)
 * - Both 'url' and 'key' persisted as required by InsForge standards
 */

(function () {
  'use strict';

  const INSFORGE_HOST = 'https://nsr7uvah.us-east.insforge.app';
  const INSFORGE_ANON = 'anon_340c28e84539db8258bca26b6aef43abda59a48abcb79f25c0efaf6eb3762e18';
  const DEFAULT_BUCKET = 'attachments';

  class InsForgeStorageEngine {
    constructor() {
      this.host = INSFORGE_HOST;
      this.anonKey = INSFORGE_ANON;
      this.defaultBucket = DEFAULT_BUCKET;
    }

    /**
     * Get active authentication token (user JWT if logged in, else anon key)
     */
    getToken() {
      if (window.classicAuth && typeof window.classicAuth.getToken === 'function') {
        const userToken = window.classicAuth.getToken();
        if (userToken) return userToken;
      }
      return localStorage.getItem('cc_insforge_token') || this.anonKey;
    }

    /**
     * Upload a File or Blob to InsForge Storage
     * @param {File|Blob} file The file object to upload
     * @param {string} [bucketName] Optional target bucket (defaults to 'attachments')
     * @param {string} [customFilename] Optional target key name
     * @returns {Promise<{ bucket: string, key: string, name: string, size: number, mimeType: string, url: string, uploadedAt: string }>}
     */
    async uploadFile(file, bucketName = this.defaultBucket, customFilename = null) {
      if (!file) throw new Error('No file selected for upload.');

      const token = this.getToken();
      const rawName = file.name || 'document.dat';
      // Sanitize filename and prepend timestamp for uniqueness
      const sanitized = rawName.replace(/[^a-zA-Z0-9._-]/g, '_');
      const objectKey = customFilename || `${Date.now()}-${sanitized}`;
      const contentType = file.type || 'application/octet-stream';
      const size = file.size;

      // ── Step 1: Request optimal upload strategy from InsForge ───────────
      const stratRes = await fetch(`${this.host}/api/storage/buckets/${bucketName}/upload-strategy`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: objectKey,
          contentType: contentType,
          size: size
        })
      });

      if (!stratRes.ok) {
        let errData = {};
        try { errData = await stratRes.json(); } catch (_) {}
        const msg = errData.message || `Upload strategy failed (HTTP ${stratRes.status})`;
        throw new Error(msg);
      }

      const strat = await stratRes.json();
      let finalKey = strat.key || objectKey;
      let finalUrl = '';

      // ── Step 2: Upload based on the returned strategy method ────────────
      if (strat.method === 'presigned') {
        // S3-compatible Presigned POST
        const formData = new FormData();
        if (strat.fields) {
          for (const [k, v] of Object.entries(strat.fields)) {
            formData.append(k, v);
          }
        }
        formData.append('file', file);

        const s3Res = await fetch(strat.uploadUrl, {
          method: 'POST',
          body: formData
        });

        // S3 presigned POST returns 200 or 204 on success
        if (!s3Res.ok && s3Res.status !== 204 && s3Res.status !== 200) {
          throw new Error(`S3 direct upload failed with status ${s3Res.status}`);
        }

        // ── Step 3: Confirm Presigned Upload ───────────────────────────────
        if (strat.confirmRequired && strat.confirmUrl) {
          const confirmRes = await fetch(`${this.host}${strat.confirmUrl}`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              size: size,
              contentType: contentType
            })
          });

          if (confirmRes.ok) {
            const confirmData = await confirmRes.json();
            finalKey = confirmData.key || finalKey;
            finalUrl = confirmData.url || '';
          }
        }
      } else {
        // Direct InsForge Storage Upload
        const uploadUrl = strat.uploadUrl.startsWith('http')
          ? strat.uploadUrl
          : `${this.host}${strat.uploadUrl}`;

        const directForm = new FormData();
        directForm.append('file', file);

        const directRes = await fetch(uploadUrl, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: directForm
        });

        if (!directRes.ok) {
          throw new Error(`Direct upload failed with status ${directRes.status}`);
        }

        const directData = await directRes.json().catch(() => ({}));
        finalKey = directData.key || finalKey;
        finalUrl = directData.url || '';
      }

      // Ensure full URL
      if (!finalUrl || !finalUrl.startsWith('http')) {
        finalUrl = `${this.host}/api/storage/buckets/${bucketName}/objects/${finalKey}`;
      }

      const result = {
        bucket: bucketName,
        key: finalKey,
        name: rawName,
        size: size,
        mimeType: contentType,
        url: finalUrl,
        uploadedAt: new Date().toISOString()
      };

      return result;
    }

    /**
     * Get download URL (presigned CDN or direct) for an object key
     */
    async getDownloadUrl(objectKey, bucketName = this.defaultBucket) {
      const token = this.getToken();
      try {
        const res = await fetch(`${this.host}/api/storage/buckets/${bucketName}/download-strategy/objects/${objectKey}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.url) return data.url;
        }
      } catch (_) {}
      return `${this.host}/api/storage/buckets/${bucketName}/objects/${objectKey}`;
    }

    /**
     * List all objects in a bucket
     */
    async listObjects(bucketName = this.defaultBucket, limit = 50) {
      const token = this.getToken();
      const res = await fetch(`${this.host}/api/storage/buckets/${bucketName}/objects?limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Failed to list objects (HTTP ${res.status})`);
      const body = await res.json();
      return body.data || [];
    }

    /**
     * Attach an uploaded file to an existing database record (order or enquiry)
     * Persists both 'attachment_url' and 'attachment_key'
     */
    async attachToRecord(tableName, recordId, uploadResult) {
      if (!window.insforgeDb) throw new Error('Database client not loaded');
      return window.insforgeDb.update(tableName, recordId, {
        attachment_url: uploadResult.url,
        attachment_key: uploadResult.key,
        attachment_name: uploadResult.name
      });
    }

    /**
     * Format byte sizes into readable strings (e.g. "1.4 MB")
     */
    formatFileSize(bytes) {
      if (!bytes || bytes === 0) return '0 B';
      const k = 1024;
      const sizes = ['B', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
  }

  // Expose globally
  window.insforgeStorage = new InsForgeStorageEngine();
})();
