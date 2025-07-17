<script lang="ts">
	export let files: any[] = [];
	export let onRefresh: (() => void) | undefined = undefined;
	
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
		try {
			window.open(`/api/files/${file.id}/download`, '_blank');
		} catch (error) {
			console.error('Error opening file:', error);
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
	{/if}
</div>

<style>
	.table-container {
		background: white;
		border-radius: 12px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
		border: 1px solid #e1e8ed;
		overflow: hidden;
	}
	
	.empty-state {
		text-align: center;
		padding: 60px 20px;
		color: #7f8c8d;
	}
	
	.empty-icon {
		font-size: 4rem;
		margin-bottom: 20px;
	}
	
	.empty-state h3 {
		margin: 0 0 10px 0;
		color: #2c3e50;
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
		background: #f8f9fa;
		padding: 16px 12px;
		text-align: left;
		font-weight: 600;
		color: #2c3e50;
		border-bottom: 2px solid #e1e8ed;
		white-space: nowrap;
	}
	
	.files-table td {
		padding: 16px 12px;
		border-bottom: 1px solid #e1e8ed;
		vertical-align: top;
	}
	
	.file-row {
		cursor: pointer;
		transition: background-color 0.2s;
	}
	
	.file-row:hover {
		background-color: #f8f9fa;
	}
	
	.title-cell {
		max-width: 300px;
	}
	
	.file-info {
		min-width: 0;
	}
	
	.file-title {
		font-weight: 600;
		color: #2c3e50;
		margin-bottom: 4px;
		word-wrap: break-word;
	}
	
	.file-description {
		color: #7f8c8d;
		font-size: 12px;
		margin-bottom: 4px;
		line-height: 1.4;
		word-wrap: break-word;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	
	.file-name {
		color: #667eea;
		font-size: 12px;
		font-family: monospace;
		word-wrap: break-word;
	}
	
	.category-badge {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 11px;
		font-weight: 500;
		white-space: nowrap;
	}
	
	.provider-badge {
		background: #e8f4f8;
		color: #2c3e50;
		padding: 4px 8px;
		border-radius: 12px;
		font-size: 11px;
		font-weight: 500;
		white-space: nowrap;
	}
	
	.roles-text {
		font-size: 12px;
		color: #7f8c8d;
	}
	
	.actions-cell {
		text-align: center;
	}
	
	.delete-btn {
		background: none;
		border: none;
		cursor: pointer;
		padding: 8px;
		border-radius: 4px;
		font-size: 16px;
		transition: background-color 0.2s;
	}
	
	.delete-btn:hover {
		background-color: #ffe6e6;
	}
	
	@media (max-width: 768px) {
		.files-table {
			font-size: 12px;
		}
		
		.files-table th,
		.files-table td {
			padding: 12px 8px;
		}
		
		.title-cell {
			max-width: 200px;
		}
	}
</style>
