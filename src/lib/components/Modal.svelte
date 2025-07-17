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
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
		padding: 20px;
		backdrop-filter: blur(4px);
	}
	
	.modal-container {
		background: white;
		border-radius: 12px;
		box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
		width: 100%;
		max-height: 90vh;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		animation: modalSlideIn 0.3s ease-out;
	}
	
	@keyframes modalSlideIn {
		from {
			opacity: 0;
			transform: scale(0.9) translateY(-20px);
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
		padding: 24px 30px;
		border-bottom: 1px solid #e1e8ed;
		flex-shrink: 0;
	}
	
	.modal-title {
		margin: 0;
		font-size: 24px;
		font-weight: 600;
		color: #2c3e50;
	}
	
	.close-btn {
		background: none;
		border: none;
		color: #7f8c8d;
		cursor: pointer;
		padding: 4px;
		border-radius: 4px;
		transition: color 0.2s, background-color 0.2s;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	
	.close-btn:hover {
		color: #2c3e50;
		background-color: #f8f9fa;
	}
	
	.modal-content {
		padding: 30px;
		overflow-y: auto;
		flex: 1;
	}
	
	@media (max-width: 768px) {
		.modal-backdrop {
			padding: 10px;
		}
		
		.modal-header {
			padding: 20px;
		}
		
		.modal-content {
			padding: 20px;
		}
		
		.modal-title {
			font-size: 20px;
		}
	}
</style>
