<script lang="ts">
	import { onMount } from 'svelte';
	import UploadForm from '$lib/components/UploadForm.svelte';
	import FileTable from '$lib/components/FileTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	
	let files: any[] = [];
	let showUploadModal = false;
	
	async function loadFiles() {
		try {
			const response = await fetch('/api/files');
			files = await response.json();
		} catch (error) {
			console.error('Error loading files:', error);
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
	<div class="action-bar">
		<button 
			class="upload-btn" 
			on:click={() => showUploadModal = true}
		>
			+ Upload New File
		</button>
	</div>
	
	<Modal 
		isOpen={showUploadModal} 
		title="Upload New File"
		onClose={() => showUploadModal = false}
	>
		<UploadForm onSuccess={handleUploadSuccess} />
	</Modal>
	
	<div class="table-section">
		<h2>Uploaded Files ({files.length})</h2>
		<FileTable {files} onRefresh={loadFiles} />
	</div>
</div>

<style>
	.page-container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
	
	.action-bar {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 20px;
	}
	
	.upload-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 12px 24px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
	}
	
	.upload-btn:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
	}
	
	.table-section h2 {
		color: #2c3e50;
		margin-bottom: 20px;
		font-size: 24px;
		font-weight: 600;
	}
</style>
