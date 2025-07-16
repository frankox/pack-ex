<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	
	const dispatch = createEventDispatcher();
	
	let formData = {
		title: '',
		description: '',
		category: '',
		language: '',
		provider: '',
		roles: [] as string[]
	};
	
	let fileInput: HTMLInputElement;
	let isUploading = false;
	let uploadProgress = 0;
	
	const categories = [
		{ value: 'LEADERSHIP', label: 'Leadership' },
		{ value: 'MANAGING_COMPLEXITY', label: 'Managing Complexity' },
		{ value: 'INNOVATION', label: 'Innovation' },
		{ value: 'STRATEGY', label: 'Strategy' },
		{ value: 'COMMUNICATION', label: 'Communication' },
		{ value: 'TEAMWORK', label: 'Teamwork' },
		{ value: 'PROBLEM_SOLVING', label: 'Problem Solving' },
		{ value: 'TECHNICAL_SKILLS', label: 'Technical Skills' }
	];
	
	const languages = [
		{ value: 'EN', label: 'English' },
		{ value: 'IT', label: 'Italian' },
		{ value: 'ES', label: 'Spanish' },
		{ value: 'FR', label: 'French' },
		{ value: 'DE', label: 'German' }
	];
	
	const providers = [
		{ value: 'SKILLA', label: 'Skilla' },
		{ value: 'LINKEDIN', label: 'LinkedIn' },
		{ value: 'PACK', label: 'Pack' },
		{ value: 'MENTOR', label: 'Mentor' },
		{ value: 'EXTERNAL', label: 'External' }
	];
	
	const roles = [
		{ value: 'MENTOR', label: 'Mentor' },
		{ value: 'COACH', label: 'Coach' },
		{ value: 'MENTEE', label: 'Mentee' },
		{ value: 'COACHEE', label: 'Coachee' }
	];
	
	function handleRoleChange(roleValue: string, checked: boolean) {
		if (checked) {
			formData.roles = [...formData.roles, roleValue];
		} else {
			formData.roles = formData.roles.filter(role => role !== roleValue);
		}
	}
	
	async function handleSubmit() {
		if (!fileInput.files || fileInput.files.length === 0) {
			alert('Please select a file to upload');
			return;
		}
		
		isUploading = true;
		uploadProgress = 0;
		
		const file = fileInput.files[0];
		const formDataToSend = new FormData();
		
		formDataToSend.append('file', file);
		formDataToSend.append('title', formData.title);
		formDataToSend.append('description', formData.description);
		formDataToSend.append('category', formData.category);
		formDataToSend.append('language', formData.language);
		formDataToSend.append('provider', formData.provider);
		formDataToSend.append('roles', JSON.stringify(formData.roles));
		
		try {
			const response = await fetch('/api/upload', {
				method: 'POST',
				body: formDataToSend
			});
			
			if (response.ok) {
				// Reset form
				formData = {
					title: '',
					description: '',
					category: '',
					language: '',
					provider: '',
					roles: []
				};
				fileInput.value = '';
				
				dispatch('success');
			} else {
				const error = await response.text();
				alert('Upload failed: ' + error);
			}
		} catch (error) {
			alert('Upload failed: ' + error);
		} finally {
			isUploading = false;
			uploadProgress = 0;
		}
	}
</script>

<form on:submit|preventDefault={handleSubmit} class="upload-form">
	<h3>Upload New File</h3>
	
	<div class="form-grid">
		<div class="form-group">
			<label for="title">Title *</label>
			<input
				id="title"
				type="text"
				bind:value={formData.title}
				maxlength="200"
				required
				placeholder="Enter file title"
			/>
			<span class="char-count">{formData.title.length}/200</span>
		</div>
		
		<div class="form-group">
			<label for="category">Category *</label>
			<select id="category" bind:value={formData.category} required>
				<option value="">Select a category</option>
				{#each categories as category}
					<option value={category.value}>{category.label}</option>
				{/each}
			</select>
		</div>
		
		<div class="form-group">
			<label for="language">Language *</label>
			<select id="language" bind:value={formData.language} required>
				<option value="">Select a language</option>
				{#each languages as language}
					<option value={language.value}>{language.label}</option>
				{/each}
			</select>
		</div>
		
		<div class="form-group">
			<label for="provider">Provider *</label>
			<select id="provider" bind:value={formData.provider} required>
				<option value="">Select a provider</option>
				{#each providers as provider}
					<option value={provider.value}>{provider.label}</option>
				{/each}
			</select>
		</div>
	</div>
	
	<div class="form-group">
		<label for="description">Description *</label>
		<textarea
			id="description"
			bind:value={formData.description}
			maxlength="1000"
			required
			placeholder="Enter file description"
			rows="4"
		></textarea>
		<span class="char-count">{formData.description.length}/1000</span>
	</div>
	
	<div class="form-group">
		<label>Roles *</label>
		<div class="checkbox-group">
			{#each roles as role}
				<label class="checkbox-label">
					<input
						type="checkbox"
						value={role.value}
						on:change={(e) => handleRoleChange(role.value, e.target?.checked)}
					/>
					{role.label}
				</label>
			{/each}
		</div>
	</div>
	
	<div class="form-group">
		<label for="file">File *</label>
		<input
			id="file"
			type="file"
			bind:this={fileInput}
			accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi"
			required
		/>
		<small class="file-help">Supported formats: PDF, TXT, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI</small>
	</div>
	
	{#if isUploading}
		<div class="upload-progress">
			<div class="progress-bar">
				<div class="progress-fill" style="width: {uploadProgress}%"></div>
			</div>
			<span>Uploading...</span>
		</div>
	{/if}
	
	<div class="form-actions">
		<button type="submit" disabled={isUploading} class="submit-btn">
			{isUploading ? 'Uploading...' : 'Upload File'}
		</button>
	</div>
</form>

<style>
	.upload-form {
		max-width: 800px;
	}
	
	.upload-form h3 {
		color: #2c3e50;
		margin-bottom: 30px;
		font-size: 24px;
		font-weight: 600;
	}
	
	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 20px;
		margin-bottom: 20px;
	}
	
	.form-group {
		margin-bottom: 20px;
	}
	
	.form-group label {
		display: block;
		margin-bottom: 8px;
		font-weight: 600;
		color: #2c3e50;
	}
	
	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: 12px;
		border: 2px solid #e1e8ed;
		border-radius: 8px;
		font-size: 16px;
		transition: border-color 0.3s, box-shadow 0.3s;
	}
	
	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: #667eea;
		box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
	}
	
	.char-count {
		display: block;
		text-align: right;
		font-size: 12px;
		color: #7f8c8d;
		margin-top: 4px;
	}
	
	.checkbox-group {
		display: flex;
		flex-wrap: wrap;
		gap: 15px;
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 8px;
		font-weight: normal;
		cursor: pointer;
	}
	
	.checkbox-label input[type="checkbox"] {
		width: auto;
		margin: 0;
	}
	
	.file-help {
		display: block;
		margin-top: 4px;
		font-size: 12px;
		color: #7f8c8d;
	}
	
	.upload-progress {
		margin: 20px 0;
	}
	
	.progress-bar {
		width: 100%;
		height: 8px;
		background-color: #e1e8ed;
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 8px;
	}
	
	.progress-fill {
		height: 100%;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		transition: width 0.3s ease;
	}
	
	.form-actions {
		text-align: center;
		margin-top: 30px;
	}
	
	.submit-btn {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border: none;
		padding: 15px 40px;
		border-radius: 8px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;
		min-width: 150px;
	}
	
	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
	}
	
	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}
</style>
