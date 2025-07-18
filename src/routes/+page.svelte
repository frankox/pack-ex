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
		<div class="main-card">
			<div class="card-header">
				<h2 class="card-title">File Manager</h2>
				<button 
					class="upload-btn" 
					on:click={() => showUploadModal = true}
				>
					<span class="btn-text">Upload</span>
				</button>
			</div>
			<div class="card-content">
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
		
		<Modal 
			isOpen={showUploadModal} 
			title="Upload New File"
			onClose={() => showUploadModal = false}
		>
			<UploadForm onSuccess={handleUploadSuccess} />
		</Modal>
		
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
	
	.main-card {
		background: var(--background-white);
		border-radius: 16px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--border-light);
		overflow: hidden;
	}
	
	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 24px 32px;
		border-bottom: 1px solid var(--border-light);
		background: var(--background-white);
	}
	
	.card-title {
		margin: 0;
		font-size: 24px;
		font-weight: 700;
		color: var(--text-primary);
	}
	
	.card-content {
		padding: 0;
	}
	
	.action-bar {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 32px;
		padding: 24px 32px;
		background: var(--background-white);
		border-radius: 16px;
		box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
		border: 1px solid var(--border-light);
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
	
	.btn-text {
		font-size: 20px;
		font-weight: 600;
		color: white;
	}
	
	.loader-container {
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 400px;
		padding: 32px;
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
		
		.card-header {
			flex-direction: column;
			gap: 20px;
			padding: 20px;
			text-align: center;
		}
		
		.card-title {
			font-size: 20px;
		}
		
		.upload-btn {
			padding: 12px 24px;
			font-size: 15px;
		}
	}
</style>
