<script lang="ts">
	import { onMount } from 'svelte';
	import UploadForm from '$lib/components/UploadForm.svelte';
	import FileTable from '$lib/components/FileTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	
	let files: any[] = [];
	let showUploadModal = false;
	let loading = true;
	
	async function loadFiles() {
		try {
			loading = true;
			const response = await fetch('/api/files');
			files = await response.json();
		} catch (error) {
			console.error('Error loading files:', error);
		} finally {
			loading = false;
		}
	}
	
	function handleUploadSuccess() {
		showUploadModal = false;
		loadFiles();
	}
	
	onMount(loadFiles);
</script>

<svelte:head>
	<title>PackEx - File Upload Manager</title>
</svelte:head>

<div class="page-container">
	<div class="content-section">
		<div class="action-bar">
			<div class="stats-info">
				<div class="stat-item">
					<span class="stat-number">{files.length}</span>
					<span class="stat-label">Files Uploaded</span>
				</div>
			</div>
			<button 
				class="upload-btn" 
				on:click={() => showUploadModal = true}
			>
				<span class="btn-icon">📁</span>
				Upload New File
			</button>
		</div>
		
		<Modal 
			isOpen={showUploadModal} 
			title="Upload New File"
			onClose={() => showUploadModal = false}
		>
			<UploadForm onSuccess={handleUploadSuccess} />
		</Modal>
		
		<div class="files-section">
			{#if loading}
				<div class="loader-container">
					<div class="loader">
						<div class="spinner"></div>
						<p class="loading-text">Loading files...</p>
					</div>
				</div>
			{:else}
				<FileTable {files} onRefresh={loadFiles} />
			{/if}
		</div>
	</div>
</div>

<style>
	.page-container {
		max-width: 1400px;
		margin: 0 auto;
		min-height: calc(100vh - 200px);
	}
	
	.content-section {
		padding: 32px 24px;
	}
	
	.action-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
		padding: 24px 32px;
		background: var(--background-white);
		border-radius: 16px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--border-light);
	}
	
	.stats-info {
		display: flex;
		gap: 32px;
	}
	
	.stat-item {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
	}
	
	.stat-number {
		font-size: 2rem;
		font-weight: 700;
		color: var(--primary-orange);
		line-height: 1;
	}
	
	.stat-label {
		font-size: 0.875rem;
		color: var(--text-secondary);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		margin-top: 4px;
	}
	
	.upload-btn {
		background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%);
		color: white;
		border: none;
		padding: 14px 28px;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		gap: 8px;
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
	}
	
	.upload-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(234, 88, 12, 0.35);
	}
	
	.btn-icon {
		font-size: 18px;
	}
	
	.files-section {
		background: transparent;
	}
	
	.loader-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400px;
		background: var(--background-white);
		border-radius: 16px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--border-light);
	}
	
	.loader {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 16px;
	}
	
	.spinner {
		width: 48px;
		height: 48px;
		border: 4px solid var(--border-light);
		border-top: 4px solid var(--primary-orange);
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}
	
	.loading-text {
		color: var(--text-secondary);
		font-size: 16px;
		font-weight: 500;
		margin: 0;
	}
	
	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}
	
	@media (max-width: 768px) {
		.content-section {
			padding: 20px 16px;
		}
		
		.action-bar {
			flex-direction: column;
			gap: 20px;
			padding: 20px;
			text-align: center;
		}
		
		.stats-info {
			justify-content: center;
		}
		
		.stat-number {
			font-size: 1.75rem;
		}
		
		.upload-btn {
			padding: 12px 24px;
			font-size: 15px;
		}
	}
</style>
