<script lang="ts">
	import '../app.css';
</script>

<main class="container">
	<header class="gradient-bg">
		<div class="header-content">
			<div class="logo-section">
				<img src="/pack-logo.png" alt="Pack" class="pack-logo" />
				<div class="brand-info">
					<h1>PackEx</h1>
					<p>File Upload Manager</p>
				</div>
			</div>
		</div>
	</header>
	
	<slot />
</main>

<style>
	.container {
		max-width: 1400px;
		margin: 0 auto;
		min-height: 100vh;
	}
	
	header {
		margin-bottom: 32px;
		border-radius: 0 0 24px 24px;
		box-shadow: 0 10px 25px rgba(234, 88, 12, 0.15);
	}
	
	.header-content {
		padding: 32px 40px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 24px;
	}
	
	.logo-section {
		display: flex;
		align-items: center;
		gap: 20px;
	}
	
	.pack-logo {
		height: 48px;
		width: auto;
		background: rgba(255, 255, 255, 0.9);
		padding: 8px 12px;
		border-radius: 8px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
	}
	
	.brand-info h1 {
		margin: 0 0 4px 0;
		font-size: 2rem;
		font-weight: 700;
		color: rgb(0, 0, 0);
		line-height: 1.2;
	}
	
	.brand-info p {
		margin: 0;
		color: rgb(0, 0, 0);
		font-size: 1rem;
		font-weight: 500;
	}
	
	@media (max-width: 768px) {
		.header-content {
			flex-direction: column;
			text-align: center;
			padding: 24px 20px;
		}
		
		.logo-section {
			flex-direction: column;
			gap: 16px;
		}
		
		.pack-logo {
			height: 40px;
		}
		
		.brand-info h1 {
			font-size: 1.75rem;
		}
	}
</style>
