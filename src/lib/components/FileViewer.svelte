<script lang="ts">
	import Modal from './Modal.svelte';
	
	export let isOpen = false;
	export let file: any = null;
	export let onClose: (() => void) | undefined = undefined;
	
	let isLoading = true;
	let hasError = false;
	let fileUrl = '';
	
	$: if (isOpen && file) {
		loadFile();
	}
	
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
	
	async function loadFile() {
		if (!file) return;
		
		isLoading = true;
		hasError = false;
		
		try {
			const response = await fetch(`/api/files/${file.id}/download`);
			if (response.ok) {
				const finalUrl = response.url;
				fileUrl = finalUrl;
			} else {
				throw new Error('Failed to get file URL');
			}
		} catch (error) {
			console.error('Error loading file:', error);
			hasError = true;
		} finally {
			isLoading = false;
		}
	}
	
	function downloadFile() {
		if (file) {
			window.open(`/api/files/${file.id}/download`, '_blank');
		}
	}
	
	function canPreview(mimeType: string): boolean {
		if (!mimeType) return false;
		
		const previewableTypes = [
			'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
			'application/pdf',
			'text/plain', 'text/html', 'text/css', 'text/javascript',
			'application/json', 'application/xml',
			'video/mp4', 'video/webm', 'video/ogg',
			'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/mpeg'
		];
		
		return previewableTypes.includes(mimeType.toLowerCase());
	}
	
	function isImage(mimeType: string): boolean {
		return mimeType?.startsWith('image/') || false;
	}
	
	function isVideo(mimeType: string): boolean {
		return mimeType?.startsWith('video/') || false;
	}
	
	function isAudio(mimeType: string): boolean {
		return mimeType?.startsWith('audio/') || false;
	}
	
	function isPDF(mimeType: string): boolean {
		return mimeType === 'application/pdf';
	}
	
	function isText(mimeType: string): boolean {
		return mimeType?.startsWith('text/') || 
			   ['application/json', 'application/xml'].includes(mimeType);
	}
</script>

<Modal 
	bind:isOpen 
	title={file?.title || 'File Preview'} 
	maxWidth="1200px"
	onClose={onClose}
>
	{#if file}
		<div class="file-viewer">
			<div class="file-header">
				<div class="file-info">
					<h3 class="file-title">{file.title}</h3>
					<p class="file-description">{file.description}</p>
					<div class="file-meta">
						<span class="file-name">{file.fileName}</span>
						<span class="file-size">{formatFileSize(file.fileSize)}</span>
						<span class="file-type">{file.mimeType}</span>
					</div>
				</div>
				<button class="download-btn" on:click={downloadFile}>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						<path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
					Download
				</button>
			</div>
			
			<div class="file-content">
				{#if isLoading}
					<div class="loading-state">
						<div class="loading-spinner"></div>
						<p>Loading file...</p>
					</div>
				{:else if hasError || !canPreview(file.mimeType)}
					<div class="preview-unavailable">
						<div class="preview-icon">📄</div>
						<h4>Preview not available</h4>
						<p>This file type cannot be previewed in the browser.</p>
						<button class="download-alt-btn" on:click={downloadFile}>
							Download File
						</button>
					</div>
				{:else if isImage(file.mimeType)}
					<div class="image-container">
						<img src={fileUrl} alt={file.title} />
					</div>
				{:else if isPDF(file.mimeType)}
					<div class="pdf-container">
						<iframe src={fileUrl} title={file.title}></iframe>
					</div>
				{:else if isVideo(file.mimeType)}
					<div class="video-container">
						<video controls>
							<source src={fileUrl} type={file.mimeType}>
							<track kind="captions" src="" srclang="en" label="English" default>
							Your browser does not support the video tag.
						</video>
					</div>
				{:else if isAudio(file.mimeType)}
					<div class="audio-container">
						<audio controls>
							<source src={fileUrl} type={file.mimeType}>
							Your browser does not support the audio element.
						</audio>
					</div>
				{:else if isText(file.mimeType)}
					<div class="text-container">
						<iframe src={fileUrl} title={file.title}></iframe>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</Modal>

<style>
	.file-viewer {
		display: flex;
		flex-direction: column;
		height: 70vh;
		min-height: 500px;
	}
	
	.file-header {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 24px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--border-light);
	}
	
	.file-info {
		flex: 1;
	}
	
	.file-title {
		margin: 0 0 8px 0;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--text-primary);
	}
	
	.file-description {
		margin: 0 0 12px 0;
		color: var(--text-secondary);
		line-height: 1.5;
	}
	
	.file-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;
		font-size: 0.875rem;
	}
	
	.file-name {
		color: var(--primary-orange);
		font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
		background: #fffbf7;
		padding: 4px 8px;
		border-radius: 6px;
		font-weight: 500;
	}
	
	.file-size,
	.file-type {
		color: var(--text-secondary);
		background: var(--background-light);
		padding: 4px 8px;
		border-radius: 6px;
	}
	
	.download-btn {
		display: flex;
		align-items: center;
		gap: 8px;
		background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%);
		color: white;
		border: none;
		padding: 12px 20px;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.2);
	}
	
	.download-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(234, 88, 12, 0.3);
	}
	
	.file-content {
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0;
	}
	
	.loading-state,
	.preview-unavailable {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		flex: 1;
		text-align: center;
		color: var(--text-secondary);
	}
	
	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid var(--border-light);
		border-top: 3px solid var(--primary-orange);
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 16px;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	.preview-icon {
		font-size: 4rem;
		margin-bottom: 16px;
		opacity: 0.6;
	}
	
	.preview-unavailable h4 {
		margin: 0 0 8px 0;
		color: var(--text-primary);
		font-size: 1.25rem;
	}
	
	.preview-unavailable p {
		margin: 0 0 20px 0;
		font-size: 1rem;
	}
	
	.download-alt-btn {
		background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%);
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 10px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.download-alt-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 6px 20px rgba(234, 88, 12, 0.3);
	}
	
	.image-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--background-light);
		border-radius: 12px;
		overflow: hidden;
	}
	
	.image-container img {
		max-width: 100%;
		max-height: 100%;
		object-fit: contain;
		border-radius: 8px;
	}
	
	.pdf-container,
	.text-container {
		flex: 1;
		border-radius: 12px;
		overflow: hidden;
		border: 1px solid var(--border-light);
	}
	
	.pdf-container iframe,
	.text-container iframe {
		width: 100%;
		height: 100%;
		border: none;
	}
	
	.video-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #000;
		border-radius: 12px;
		overflow: hidden;
	}
	
	.video-container video {
		width: 100%;
		height: 100%;
		max-height: 100%;
	}
	
	.audio-container {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--background-light);
		border-radius: 12px;
		padding: 40px;
	}
	
	.audio-container audio {
		width: 100%;
		max-width: 500px;
	}
	
	@media (max-width: 768px) {
		.file-header {
			flex-direction: column;
			gap: 16px;
		}
		
		.file-meta {
			flex-direction: column;
			gap: 8px;
		}
		
		.download-btn {
			align-self: flex-start;
		}
		
		.file-viewer {
			height: 60vh;
			min-height: 400px;
		}
	}
</style>
