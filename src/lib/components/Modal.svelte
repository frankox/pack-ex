<script lang="ts">
	export let isOpen = false;
	export let title = '';
	export let maxWidth = '800px';
	export let onClose: (() => void) | undefined = undefined;
	
	function closeModal() {
		onClose?.();
	}
	
	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeModal();
		}
	}
	
	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
	<div class="modal-backdrop" on:click={handleBackdropClick} role="presentation">
		<div class="modal-container" style="max-width: {maxWidth}">
			<div class="modal-header">
				<h2 class="modal-title">{title}</h2>
				<button class="close-btn" on:click={closeModal} aria-label="Close modal">
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</button>
			</div>
			<div class="modal-content">
				<slot />
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(15, 23, 42, 0.6);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 20px;
		backdrop-filter: blur(8px);
		-webkit-backdrop-filter: blur(8px);
	}
	
	.modal-container {
		background: var(--background-white);
		border-radius: 20px;
		box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
		width: 100%;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		animation: modalSlideIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
		border: 1px solid var(--border-light);
	}
	
	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: scale(0.85) translateY(-40px);
		}
		to {
			opacity: 1;
			transform: scale(1) translateY(0);
		}
	}
	
	.modal-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 32px 40px 24px;
		border-bottom: 1px solid var(--border-light);
		flex-shrink: 0;
		background: linear-gradient(135deg, var(--background-white) 0%, var(--background-light) 100%);
	}
	
	.modal-title {
		margin: 0;
		font-size: 1.75rem;
		font-weight: 700;
		color: var(--text-primary);
		letter-spacing: -0.025em;
	}
	
	.close-btn {
		background: none;
		border: none;
		color: var(--text-secondary);
		cursor: pointer;
		padding: 8px;
		border-radius: 8px;
		transition: all 0.3s ease;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.close-btn:hover {
		color: var(--primary-blue);
		background: linear-gradient(135deg, #fafbff 0%, var(--background-light) 100%);
		transform: scale(1.1);
	}
	
	.modal-content {
		padding: 40px;
		overflow-y: auto;
		flex: 1;
		background: var(--background-white);
	}
	
	@media (max-width: 768px) {
		.modal-backdrop {
			padding: 16px;
		}
		
		.modal-container {
			border-radius: 16px;
		}
		
		.modal-header {
			padding: 24px 24px 20px;
		}
		
		.modal-content {
			padding: 24px;
		}
		
		.modal-title {
			font-size: 1.5rem;
		}
	}
</style>
