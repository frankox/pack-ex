<script lang="ts">
	import FileViewer from './FileViewer.svelte';
	
	export let files: any[] = [];
	export let pagination: any = null;
	export let onRefresh: (() => void) | undefined = undefined;
	export let onPageChange: ((page: number) => void) | undefined = undefined;
	export let onPageSizeChange: ((pageSize: number) => void) | undefined = undefined;
	
	let selectedFile: any = null;
	let isViewerOpen = false;
	
	const pageSizeOptions = [5, 10, 20, 50];
	
	function formatFileSize(bytes: number): string {
		if (bytes === 0) return '0 Bytes';
		const k = 1024;
		const sizes = ['Bytes', 'KB', 'MB', 'GB'];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
	}
	
	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
	
	function getCategoryLabel(category: string): string {
		const labels: Record<string, string> = {
			'LEADERSHIP': 'Leadership',
			'MANAGING_COMPLEXITY': 'Managing Complexity',
			'INNOVATION': 'Innovation',
			'STRATEGY': 'Strategy',
			'COMMUNICATION': 'Communication',
			'TEAMWORK': 'Teamwork',
			'PROBLEM_SOLVING': 'Problem Solving',
			'TECHNICAL_SKILLS': 'Technical Skills'
		};
		return labels[category] || category;
	}
	
	function getLanguageLabel(language: string): string {
		const labels: Record<string, string> = {
			'EN': 'English',
			'IT': 'Italian',
			'ES': 'Spanish',
			'FR': 'French',
			'DE': 'German'
		};
		return labels[language] || language;
	}
	
	function getProviderLabel(provider: string): string {
		const labels: Record<string, string> = {
			'SKILLA': 'Skilla',
			'LINKEDIN': 'LinkedIn',
			'PACK': 'Pack',
			'MENTOR': 'Mentor',
			'EXTERNAL': 'External'
		};
		return labels[provider] || provider;
	}
	
	function getRoleLabels(roles: string[]): string {
		const labels: Record<string, string> = {
			'MENTOR': 'Mentor',
			'COACH': 'Coach',
			'MENTEE': 'Mentee',
			'COACHEE': 'Coachee'
		};
		return roles.map(role => labels[role] || role).join(', ');
	}
	
	async function handleRowClick(file: any) {
		selectedFile = file;
		isViewerOpen = true;
	}
	
	async function handleDownload(file: any, event: Event) {
		event.stopPropagation();
		
		try {
			window.open(`/api/files/${file.id}/download`, '_blank');
		} catch (error) {
			console.error('Error downloading file:', error);
		}
	}
	
	async function handleDelete(file: any, event: Event) {
		event.stopPropagation();
		
		if (!confirm(`Are you sure you want to delete "${file.title}"?`)) {
			return;
		}
		
		try {
			const response = await fetch(`/api/files/${file.id}`, {
				method: 'DELETE'
			});
			
			if (response.ok) {
				onRefresh?.();
			} else {
				alert('Failed to delete file');
			}
		} catch (error) {
			alert('Error deleting file: ' + error);
		}
	}
</script>

<div class="table-container">
	{#if files.length === 0}
		<div class="empty-state">
			<div class="empty-icon">📁</div>
			<h3>No files uploaded yet</h3>
			<p>Upload your first file to get started</p>
		</div>
	{:else}
		<div class="table-wrapper">
			<table class="files-table">
				<thead>
					<tr>
						<th>Title</th>
						<th>Category</th>
						<th>Language</th>
						<th>Provider</th>
						<th>Roles</th>
						<th>File Size</th>
						<th>Upload Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each files as file}
						<tr class="file-row" on:click={() => handleRowClick(file)}>
							<td class="title-cell">
								<div class="file-info">
									<div class="file-title">{file.title}</div>
									<div class="file-description">{file.description}</div>
									<div class="file-name">{file.fileName}</div>
								</div>
							</td>
							<td>
								<span class="category-badge">{getCategoryLabel(file.category)}</span>
							</td>
							<td>{getLanguageLabel(file.language)}</td>
							<td>
								<span class="provider-badge">{getProviderLabel(file.provider)}</span>
							</td>
							<td>
								<span class="roles-text">{getRoleLabels(file.roles)}</span>
							</td>
							<td>{formatFileSize(file.fileSize)}</td>
							<td>{formatDate(file.createdAt)}</td>
							<td class="actions-cell">
								<button 
									class="download-btn" 
									on:click={(e) => handleDownload(file, e)}
									title="Download file"
								>
									📥
								</button>
								<button 
									class="delete-btn" 
									on:click={(e) => handleDelete(file, e)}
									title="Delete file"
								>
									🗑️
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
		
		{#if pagination}
			<div class="pagination-container">
				<div class="pagination-info">
					<span class="results-count">
						Showing {((pagination.currentPage - 1) * pagination.pageSize) + 1} - 
						{Math.min(pagination.currentPage * pagination.pageSize, pagination.totalCount)} 
						of {pagination.totalCount} files
					</span>
					
					<div class="page-size-selector">
						<label for="pageSize">Show:</label>
						<select 
							id="pageSize" 
							value={pagination.pageSize} 
							on:change={(e) => onPageSizeChange?.(parseInt(e.currentTarget.value))}
						>
							{#each pageSizeOptions as size}
								<option value={size}>{size}</option>
							{/each}
						</select>
						<span>per page</span>
					</div>
				</div>
				
				<div class="pagination-controls">
					<button 
						class="pagination-btn" 
						class:disabled={!pagination.hasPreviousPage}
						disabled={!pagination.hasPreviousPage}
						on:click={() => onPageChange?.(1)}
					>
						⟪
					</button>
					
					<button 
						class="pagination-btn" 
						class:disabled={!pagination.hasPreviousPage}
						disabled={!pagination.hasPreviousPage}
						on:click={() => onPageChange?.(pagination.currentPage - 1)}
					>
						‹ Previous
					</button>
					
					<div class="page-numbers">
						{#each Array.from({length: Math.min(5, pagination.totalPages)}, (_, i) => {
							const start = Math.max(1, pagination.currentPage - 2);
							const end = Math.min(pagination.totalPages, start + 4);
							return start + i <= end ? start + i : null;
						}).filter(Boolean) as pageNum}
							<button 
								class="page-number" 
								class:current={pageNum === pagination.currentPage}
								on:click={() => onPageChange?.(pageNum)}
							>
								{pageNum}
							</button>
						{/each}
					</div>
					
					<button 
						class="pagination-btn" 
						class:disabled={!pagination.hasNextPage}
						disabled={!pagination.hasNextPage}
						on:click={() => onPageChange?.(pagination.currentPage + 1)}
					>
						Next ›
					</button>
					
					<button 
						class="pagination-btn" 
						class:disabled={!pagination.hasNextPage}
						disabled={!pagination.hasNextPage}
						on:click={() => onPageChange?.(pagination.totalPages)}
					>
						⟫
					</button>
				</div>
			</div>
		{/if}
	{/if}
</div>

<FileViewer 
	bind:isOpen={isViewerOpen} 
	file={selectedFile} 
	onClose={() => isViewerOpen = false} 
/>

<style>
	.table-container {
		background: var(--background-white);
		border-radius: 16px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
		border: 1px solid var(--border-light);
		overflow: hidden;
		margin: 32px auto;
		max-width: 1200px;
	}
	
	.empty-state {
		text-align: center;
		padding: 80px 20px;
		color: var(--text-secondary);
	}
	
	.empty-icon {
		font-size: 4rem;
		margin-bottom: 24px;
		opacity: 0.6;
	}
	
	.empty-state h3 {
		margin: 0 0 12px 0;
		color: var(--text-primary);
		font-size: 1.5rem;
		font-weight: 600;
	}
	
	.empty-state p {
		margin: 0;
		font-size: 1rem;
		font-weight: 500;
	}
	
	.table-wrapper {
		overflow-x: auto;
	}
	
	.files-table {
		width: 100%;
		border-collapse: collapse;
		font-size: 14px;
	}
	
	.files-table th {
		background: linear-gradient(135deg, var(--background-light) 0%, #f1f5f9 100%);
		padding: 20px 16px;
		text-align: left;
		font-weight: 600;
		color: var(--text-primary);
		border-bottom: 2px solid var(--border-light);
		white-space: nowrap;
		font-size: 13px;
		letter-spacing: 0.025em;
		text-transform: uppercase;
	}
	
	.files-table td {
		padding: 20px 16px;
		border-bottom: 1px solid var(--border-light);
		vertical-align: top;
	}
	
	.file-row {
		cursor: pointer;
		transition: all 0.3s ease;
	}
	
	.file-row:hover {
		background: linear-gradient(135deg, #fffbf7 0%, var(--background-light) 100%);
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.08);
	}
	
	.title-cell {
		max-width: 350px;
	}
	
	.file-info {
		min-width: 0;
	}
	
	.file-title {
		font-weight: 600;
		color: var(--text-primary);
		margin-bottom: 6px;
		word-wrap: break-word;
		font-size: 15px;
		line-height: 1.4;
	}
	
	.file-description {
		color: var(--text-secondary);
		font-size: 13px;
		margin-bottom: 6px;
		line-height: 1.4;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.file-name {
		color: var(--primary-orange);
		font-size: 12px;
		font-family: 'SF Mono', 'Monaco', 'Consolas', monospace;
		word-wrap: break-word;
		font-weight: 500;
		background: #fffbf7;
		padding: 2px 6px;
		border-radius: 4px;
		display: inline-block;
	}
	
	.category-badge {
		background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%);
		color: white;
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 11px;
		font-weight: 600;
		white-space: nowrap;
		letter-spacing: 0.025em;
		box-shadow: 0 2px 4px rgba(234, 88, 12, 0.2);
	}
	
	.provider-badge {
		background: linear-gradient(135deg, var(--background-light) 0%, #e2e8f0 100%);
		color: var(--text-primary);
		padding: 6px 12px;
		border-radius: 20px;
		font-size: 11px;
		font-weight: 600;
		white-space: nowrap;
		letter-spacing: 0.025em;
		border: 1px solid var(--border-light);
	}
	
	.roles-text {
		font-size: 13px;
		color: var(--text-secondary);
		font-weight: 500;
	}
	
	.actions-cell {
		text-align: center;
	}
	
	.download-btn,
	.delete-btn {
		border: none;
		cursor: pointer;
		padding: 10px 12px;
		border-radius: 8px;
		font-size: 16px;
		transition: all 0.3s ease;
		margin: 0 4px;
	}
	
	.download-btn {
		background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
		border: 1px solid #bfdbfe;
		color: #1d4ed8;
	}
	
	.download-btn:hover {
		background: linear-gradient(135deg, #1d4ed8 0%, #1e40af 100%);
		color: white;
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(29, 78, 216, 0.3);
	}
	
	.delete-btn {
		background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
		border: 1px solid #fecaca;
		color: var(--error-red);
	}
	
	.delete-btn:hover {
		background: linear-gradient(135deg, var(--error-red) 0%, #dc2626 100%);
		color: white;
		transform: scale(1.05);
		box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
	}
	
	/* Pagination Styles */
	.pagination-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 20px 32px;
		border-top: 1px solid var(--border-light);
		background: var(--background-white);
		flex-wrap: wrap;
		gap: 16px;
	}
	
	.pagination-info {
		display: flex;
		align-items: center;
		gap: 24px;
		color: var(--text-secondary);
		font-size: 14px;
	}
	
	.results-count {
		font-weight: 500;
	}
	
	.page-size-selector {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	.page-size-selector select {
		padding: 6px 12px;
		border: 1px solid var(--border-light);
		border-radius: 8px;
		background: var(--background-white);
		color: var(--text-primary);
		font-size: 14px;
		cursor: pointer;
		transition: all 0.2s ease;
	}
	
	.page-size-selector select:hover {
		border-color: var(--primary-orange);
	}
	
	.page-size-selector select:focus {
		outline: none;
		border-color: var(--primary-orange);
		box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.1);
	}
	
	.pagination-controls {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	
	.pagination-btn {
		padding: 8px 16px;
		border: 1px solid var(--border-light);
		border-radius: 8px;
		background: var(--background-white);
		color: var(--text-primary);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		min-width: 44px;
		height: 40px;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.pagination-btn:hover:not(.disabled) {
		background: var(--primary-orange);
		color: white;
		border-color: var(--primary-orange);
		transform: translateY(-1px);
	}
	
	.pagination-btn.disabled {
		opacity: 0.5;
		cursor: not-allowed;
		background: var(--background-gray);
		color: var(--text-disabled);
	}
	
	.page-numbers {
		display: flex;
		gap: 4px;
		margin: 0 8px;
	}
	
	.page-number {
		width: 40px;
		height: 40px;
		border: 1px solid var(--border-light);
		border-radius: 8px;
		background: var(--background-white);
		color: var(--text-primary);
		font-size: 14px;
		font-weight: 500;
		cursor: pointer;
		transition: all 0.2s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.page-number:hover {
		background: var(--background-gray);
		border-color: var(--primary-orange);
	}
	
	.page-number.current {
		background: var(--primary-orange);
		color: white;
		border-color: var(--primary-orange);
	}
	
	@media (max-width: 1024px) {
		.table-container {
			margin: 20px;
			border-radius: 12px;
		}
		
		.pagination-container {
			padding: 16px 20px;
			flex-direction: column;
			align-items: stretch;
			gap: 16px;
		}
		
		.pagination-info {
			justify-content: space-between;
			flex-wrap: wrap;
		}
		
		.pagination-controls {
			justify-content: center;
		}
	}
	
	@media (max-width: 768px) {
		.files-table {
			font-size: 12px;
		}
		
		.files-table th,
		.files-table td {
			padding: 16px 12px;
		}
		
		.title-cell {
			max-width: 250px;
		}
		
		.file-title {
			font-size: 14px;
		}
		
		.file-description {
			font-size: 12px;
		}
		
		.category-badge,
		.provider-badge {
			font-size: 10px;
			padding: 4px 8px;
		}
		
		.pagination-container {
			padding: 12px 16px;
		}
		
		.pagination-info {
			font-size: 12px;
			flex-direction: column;
			align-items: flex-start;
			gap: 12px;
		}
		
		.pagination-controls {
			flex-wrap: wrap;
			gap: 4px;
		}
		
		.pagination-btn {
			padding: 6px 12px;
			font-size: 12px;
			min-width: 36px;
			height: 36px;
		}
		
		.page-number {
			width: 36px;
			height: 36px;
			font-size: 12px;
		}
		
		.page-numbers {
			margin: 0 4px;
		}
	}
</style>
