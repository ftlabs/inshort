<template>
  <header class="o-header-services" data-o-component="o-header">
	<div class="o-header-services__top o-header-services__container header-container">
		<div class="o-header-services__hamburger">
			<a class="o-header-services__hamburger-icon" href="#o-header-drawer" aria-controls="o-header-drawer"><span class="o-header__visually-hidden">Menu</span></a>
		</div>
		<div class="o-header-services__ftlogo"></div>
		<div class="o-header-services__title">
			<h1 class="o-header-services__product-name"><a href="/">FTLabs</a></h1><span class="o-header-subrand__product-tagline">InShort</span>
		</div>
		
	</div>
	<div class="o-header-services__primary-nav">
		<div class="o-header-services__container header-container">
			<ul class="o-header-services__nav-list">
				<li class="o-header-services__nav-item">
						<router-link class="o-header-services__nav-link" to="/">Article summary experiments</router-link>
				</li>
				<li class="o-header-services__nav-item">
					<router-link class="o-header-services__nav-link" to="/topics">Topic Summary</router-link>
				</li>
			</ul>
		</div>
	</div>
</header>
</template>
<style scoped>
    .header-container {
      margin-left:0;
    }
</style>

