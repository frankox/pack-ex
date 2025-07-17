<script lang="ts">
	export let onSuccess: (() => void) | undefined = undefined;
	
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
				formData = {
					title: '',
					description: '',
					category: '',
					language: '',
					provider: '',
					roles: []
				};
				fileInput.value = '';
				
				onSuccess?.();
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
		<fieldset>
			<legend>Roles *</legend>
			<div class="checkbox-group">
				{#each roles as role}
					<label class="checkbox-label">
						<input
							type="checkbox"
							value={role.value}
							on:change={(e) => handleRoleChange(role.value, (e.target as HTMLInputElement)?.checked)}
						/>
						{role.label}
					</label>
				{/each}
			</div>
		</fieldset>
	</div>
	
	<div class="form-group">
		<label for="file">File *</label>
		<input
			id="file"
			type="file"
			bind:this={fileInput}
			accept=".pdf,.txt,.doc,.docx,.ppt,.pptx,.mp4,.mov,.avi,.zip,.rar,.jpg,.jpeg,.png"
			required
		/>
		<small class="file-help">Supported formats: PDF, TXT, DOC, DOCX, PPT, PPTX, MP4, MOV, AVI, ZIP, RAR, JPG, JPEG, PNG</small>
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
		max-width: 900px;
		margin: 0 auto;
		background: var(--background-white);
		border-radius: 16px;
		padding: 32px;
		box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
		border: 1px solid var(--border-light);
	}
	
	.form-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 24px;
		margin-bottom: 24px;
	}
	
	.form-group {
		margin-bottom: 24px;
	}
	
	.form-group label {
		display: block;
		margin-bottom: 8px;
		font-weight: 600;
		color: var(--text-primary);
		font-size: 14px;
		letter-spacing: 0.025em;
	}
	
	.form-group input,
	.form-group select,
	.form-group textarea {
		width: 100%;
		padding: 14px 16px;
		border: 2px solid var(--border-light);
		border-radius: 12px;
		font-size: 14px;
		font-family: inherit;
		transition: all 0.3s ease;
		background-color: var(--background-white);
	}
	
	.form-group input:focus,
	.form-group select:focus,
	.form-group textarea:focus {
		outline: none;
		border-color: var(--primary-orange);
		box-shadow: 0 0 0 4px rgba(234, 88, 12, 0.1);
		background-color: #fffbf7;
	}
	
	.char-count {
		display: block;
		text-align: right;
		font-size: 12px;
		color: var(--text-secondary);
		margin-top: 6px;
		font-weight: 500;
	}
	
	fieldset {
		border: none;
		padding: 0;
		margin: 0;
	}
	
	legend {
		display: block;
		margin-bottom: 12px;
		font-weight: 600;
		color: var(--text-primary);
		padding: 0;
		font-size: 14px;
		letter-spacing: 0.025em;
	}
	
	.checkbox-group {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
		gap: 16px;
		padding: 16px;
		background: var(--background-light);
		border-radius: 12px;
		border: 2px solid var(--border-light);
	}
	
	.checkbox-label {
		display: flex;
		align-items: center;
		gap: 10px;
		font-weight: 500;
		cursor: pointer;
		color: var(--text-primary);
		transition: all 0.2s ease;
		padding: 8px 12px;
		border-radius: 8px;
	}
	
	.checkbox-label:hover {
		background: var(--background-white);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
	}
	
	.checkbox-label input[type="checkbox"] {
		width: 18px;
		height: 18px;
		margin: 0;
		accent-color: var(--primary-orange);
	}
	
	.file-help {
		display: block;
		margin-top: 6px;
		font-size: 12px;
		color: var(--text-secondary);
		line-height: 1.4;
		font-weight: 500;
	}
	
	.upload-progress {
		margin: 24px 0;
		padding: 20px;
		background: var(--background-light);
		border-radius: 12px;
		text-align: center;
	}
	
	.progress-bar {
		width: 100%;
		height: 8px;
		background-color: var(--border-medium);
		border-radius: 4px;
		overflow: hidden;
		margin-bottom: 12px;
	}
	
	.progress-fill {
		height: 100%;
		background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%);
		transition: width 0.3s ease;
		border-radius: 4px;
	}
	
	.upload-progress span {
		color: var(--text-primary);
		font-weight: 600;
		font-size: 14px;
	}
	
	.form-actions {
		text-align: center;
		margin-top: 32px;
		padding-top: 24px;
		border-top: 1px solid var(--border-light);
	}
	
	.submit-btn {
		background: linear-gradient(135deg, var(--primary-orange) 0%, var(--secondary-orange) 100%);
		color: white;
		border: none;
		padding: 16px 48px;
		border-radius: 12px;
		font-size: 16px;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease;
		min-width: 180px;
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25);
	}
	
	.submit-btn:hover:not(:disabled) {
		transform: translateY(-2px);
		box-shadow: 0 8px 25px rgba(234, 88, 12, 0.35);
	}
	
	.submit-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
		box-shadow: 0 4px 12px rgba(234, 88, 12, 0.15);
	}
	
	@media (max-width: 768px) {
		.upload-form {
			margin: 20px;
			padding: 24px 20px;
		}
		
		.form-grid {
			grid-template-columns: 1fr;
			gap: 20px;
		}
		
		.checkbox-group {
			grid-template-columns: 1fr;
		}
	}
</style>
