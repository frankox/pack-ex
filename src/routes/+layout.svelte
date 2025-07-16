<script lang="ts">
	import '../app.css';
</script>

<main class="container">
	<header>
		<h1>PackEx - File Upload Manager</h1>
		<p>Upload and manage your content files</p>
	</header>
	
	<slot />
</main>

<style>
	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 20px;
	}
	
	header {
		text-align: center;
		margin-bottom: 40px;
		padding: 20px;
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 10px;
	}
	
	header h1 {
		margin: 0 0 10px 0;
		font-size: 2.5rem;
		font-weight: 700;
	}
	
	header p {
		margin: 0;
		opacity: 0.9;
		font-size: 1.1rem;
	}
</style>
