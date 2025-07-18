<script lang="ts">
	import { onMount } from 'svelte';
	import UploadForm from '$lib/components/UploadForm.svelte';
	import FileTable from '$lib/components/FileTable.svelte';
	import Modal from '$lib/components/Modal.svelte';
	
	let files: any[] = [];
	let pagination: any = null;
	let showUploadModal = false;
	let loading = true;
	let searchQuery = '';
	let searchTimeout: ReturnType<typeof setTimeout> | null = null;
	
	// Pagination state
	let currentPage = 1;
	let pageSize = 10;
	
	async function loadFiles() {
		try {
			loading = true;
			const params = new URLSearchParams({
				page: currentPage.toString(),
				pageSize: pageSize.toString()
			});
			
			if (searchQuery.trim().length >= 3) {
				params.append('search', searchQuery.trim());
			}
			
			const response = await fetch(`/api/files?${params}`);
			const data = await response.json();
			
			if (response.ok) {
				files = data.files;
				pagination = data.pagination;
			} else {
				console.error('Error loading files:', data.error);
			}
		} catch (error) {
			console.error('Error loading files:', error);
		} finally {
			loading = false;
		}
	}
	
	function handleSearchInput() {
		// Clear existing timeout
		if (searchTimeout) {
			clearTimeout(searchTimeout);
		}
		
		// Only search if query has at least 3 characters or is empty (to reset)
		if (searchQuery.trim().length >= 3 || searchQuery.trim().length === 0) {
			searchTimeout = setTimeout(() => {
				currentPage = 1; // Reset to first page when searching
				loadFiles();
			}, 300);
		}
	}
	
	function handleUploadSuccess() {
		showUploadModal = false;
		// Reset to first page when a new file is uploaded
		currentPage = 1;
		loadFiles();
	}
	
	function handlePageChange(page: number) {
		currentPage = page;
		loadFiles();
	}
	
	function handlePageSizeChange(newPageSize: number) {
		pageSize = newPageSize;
		currentPage = 1; // Reset to first page when changing page size
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
				<div class="search-container">
					<input 
						type="text" 
						placeholder="Search files (title, description, filename)..." 
						bind:value={searchQuery}
						on:input={handleSearchInput}
						class="search-input"
					/>
					<svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</div>
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
					<FileTable 
						{files} 
						{pagination}
						onRefresh={loadFiles} 
						onPageChange={handlePageChange}
						onPageSizeChange={handlePageSizeChange}
					/>
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
		justify-content: end;
		align-items: center;
		padding: 24px 32px;
		border-bottom: 1px solid var(--border-light);
		background: var(--background-white);
		gap: 24px;
	}
	
	.search-container {
		flex: 1;
		max-width: 400px;
		position: relative;
	}
	
	.search-input {
		width: 100%;
		padding: 12px 16px 12px 44px;
		border: 2px solid var(--border-light);
		border-radius: 12px;
		font-size: 14px;
		background: var(--background-white);
		transition: all 0.3s ease;
		color: var(--text-primary);
	}
	
	.search-input:focus {
		outline: none;
		border-color: var(--primary-orange);
		box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
	}
	
	.search-input::placeholder {
		color: var(--text-secondary);
	}
	
	.search-icon {
		position: absolute;
		left: 14px;
		top: 50%;
		transform: translateY(-50%);
		color: var(--text-secondary);
		pointer-events: none;
	}
	
	.card-content {
		padding: 0;
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
			gap: 16px;
			padding: 20px;
			text-align: center;
		}
		
		.search-container {
			max-width: none;
			width: 100%;
		}
		
		.upload-btn {
			padding: 12px 24px;
			font-size: 15px;
			width: 100%;
			justify-content: center;
		}
	}
</style>
