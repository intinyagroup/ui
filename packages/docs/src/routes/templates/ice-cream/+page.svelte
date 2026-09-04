<script lang="ts">
	import {
		Button,
		Card,
		Badge,
		Input,
		Avatar,
		AvatarFallback,
		AvatarImage,
		Rating,
		Separator
	} from '@intinyagroup/ui';
	import {
		Search,
		ShoppingBag,
		ArrowRight,
		ChevronLeft,
		ChevronRight,
		Star,
		Sparkles,
		Heart,
		Truck,
		Leaf,
		Check,
		Mail
	} from 'lucide-svelte';

	// Data for Flavors Carousel
	const flavors = [
		{
			id: 1,
			name: 'Salted Caramel',
			color: '#FFE8D6',
			badge: 'Popular',
			image: '/templates/ice-cream/flavor-caramel.jpg'
		},
		{
			id: 2,
			name: 'Classic Vanilla',
			color: '#FFF3CD',
			badge: 'Classic',
			image: '/templates/ice-cream/flavor-vanilla.jpg'
		},
		{
			id: 3,
			name: 'Chocolate Fudge',
			color: '#E8D5C4',
			badge: 'Best Seller',
			image: '/templates/ice-cream/flavor-chocolate.jpg'
		},
		{
			id: 4,
			name: 'Pistachio Bliss',
			color: '#D8E2DC',
			badge: 'New',
			image: '/templates/ice-cream/flavor-pistachio.jpg'
		},
		{
			id: 5,
			name: 'Strawberry Swirl',
			color: '#FFD6E0',
			badge: 'Seasonal',
			image: '/templates/ice-cream/flavor-strawberry.jpg'
		}
	];

	// Value props
	const valueProps = [
		{
			icon: Leaf,
			title: 'Natural Ingredients',
			desc: 'Made with real fruits, nuts & dairy.'
		},
		{
			icon: Heart,
			title: 'Handcrafted',
			desc: 'Small-batch ice cream with love.'
		},
		{
			icon: Truck,
			title: 'Fast Delivery',
			desc: 'Quick & cold delivery to your door.'
		},
		{
			icon: Sparkles,
			title: 'Eco Friendly',
			desc: 'Sustainable packaging for a better planet.'
		}
	];

	// Reviews
	const testimonials = [
		{
			name: 'Emily R.',
			quote: "The best ice cream I've ever had! Pure bliss.",
			avatar: '/templates/ice-cream/avatar-1.jpg',
			rating: 5
		},
		{
			name: 'James T.',
			quote: 'Absolutely delicious! The pistachio swirl is unmatched.',
			avatar: '/templates/ice-cream/avatar-2.jpg',
			rating: 5
		},
		{
			name: 'Sarah M.',
			quote: 'Fresh, creamy & simply perfect every single time.',
			avatar: '/templates/ice-cream/avatar-3.jpg',
			rating: 5
		}
	];

	// Community Gallery
	const gallery = [
		'/templates/ice-cream/gallery-1.jpg',
		'/templates/ice-cream/gallery-2.jpg',
		'/templates/ice-cream/gallery-3.jpg',
		'/templates/ice-cream/gallery-4.jpg'
	];

	let emailInput = $state('');
</script>

<svelte:head>
	<title>Artisanal Ice Cream — Template | Intinya UI</title>
	<link rel="preconnect" href="https://fonts.googleapis.com">
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
	<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&family=Shrikhand&display=swap" rel="stylesheet">
</svelte:head>

<!-- Local custom scoped theme tokens for Antix Ice Cream -->
<div class="icecream-theme min-h-screen bg-[#FDFBF7] text-[#2D2A26] font-sans antialiased selection:bg-[#FF6B8B] selection:text-white">
	
	<!-- Top Navigation Bar -->
	<header class="sticky top-0 z-50 bg-[#FDFBF7]/90 backdrop-blur-md transition-all">
		<div class="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
			<!-- Brand Logo -->
			<a href="/templates/ice-cream" class="flex items-center gap-2">
				<span class="text-3xl font-black tracking-tight text-[#148A7E] font-['Shrikhand',cursive]">Scoop</span>
			</a>

			<!-- Nav links -->
			<nav class="hidden md:flex items-center gap-8 text-sm font-semibold text-[#4A453E]">
				<a href="#home" class="text-[#148A7E] transition-colors">Home</a>
				<a href="#about" class="hover:text-[#148A7E] transition-colors">About Us</a>
				<a href="#flavors" class="hover:text-[#148A7E] transition-colors">Flavors</a>
				<a href="#shop" class="hover:text-[#148A7E] transition-colors">Shop</a>
				<a href="#recipes" class="hover:text-[#148A7E] transition-colors">Recipes</a>
				<a href="#contact" class="hover:text-[#148A7E] transition-colors">Contact</a>
			</nav>

			<!-- Action buttons -->
			<div class="flex items-center gap-4">
				<button class="p-2.5 rounded-full text-[#4A453E] hover:bg-[#F3EDE2] transition-colors" aria-label="Search">
					<Search class="size-5" />
				</button>
				<button class="p-2.5 rounded-full text-[#4A453E] hover:bg-[#F3EDE2] transition-colors relative" aria-label="Cart">
					<ShoppingBag class="size-5" />
					<span class="absolute top-1 right-1 size-2 bg-[#FF6B8B] rounded-full"></span>
				</button>
				<Button class="rounded-full bg-[#FF6B8B] hover:bg-[#e85877] text-white px-6 font-bold shadow-md shadow-[#FF6B8B]/20">
					Book a table
				</Button>
			</div>
		</div>
	</header>

	<!-- Main Content -->
	<main>
		<!-- HERO SECTION -->
		<section id="home" class="relative overflow-hidden pt-8 pb-20 lg:pt-12 lg:pb-32">
			<!-- Soft Organic Background Blobs -->
			<div class="absolute top-10 right-10 w-[550px] h-[550px] bg-[#FFE8D6] rounded-full blur-3xl opacity-70 -z-10 pointer-events-none"></div>
			<div class="absolute top-40 left-10 w-[400px] h-[400px] bg-[#D8E2DC] rounded-full blur-3xl opacity-50 -z-10 pointer-events-none"></div>

			<div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
				
				<!-- Left Text Column -->
				<div class="lg:col-span-6 space-y-8 text-left">
					<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F3EDE2] text-[#148A7E] text-xs font-bold tracking-wide uppercase">
						<Sparkles class="size-3.5" /> Handcrafted artisan delights
					</div>

					<h1 class="text-6xl sm:text-7xl lg:text-8xl font-black text-[#2B231D] tracking-tight leading-[0.95]">
						SCOOP.<br />
						<span class="text-[#FF6B8B]">SMILE.</span><br />
						<span class="text-[#148A7E]">REPEAT!</span>
					</h1>

					<p class="text-lg text-[#6B645C] max-w-md font-medium leading-relaxed">
						From classic favorites to exciting new flavors, every scoop is made with wholesome ingredients to bring you pure happiness.
					</p>

					<div class="flex flex-wrap items-center gap-4 pt-2">
						<Button class="rounded-full bg-[#FF6B8B] hover:bg-[#e85877] text-white px-8 py-6 text-base font-bold flex items-center gap-3 shadow-lg shadow-[#FF6B8B]/30 hover:translate-y-[-2px] transition-all">
							Join Our Team
							<span class="size-7 rounded-full bg-white/20 flex items-center justify-center">
								<ArrowRight class="size-4" />
							</span>
						</Button>
						<Button variant="outline" class="rounded-full border-[#D8CEBE] hover:bg-[#F3EDE2] px-7 py-6 text-base font-bold text-[#4A453E]">
							View Menu
						</Button>
					</div>
				</div>

				<!-- Right Visual Column (Ice cream Hero Image + Floating Rating Badge) -->
				<div class="lg:col-span-6 relative flex justify-center items-center">
					<!-- Hero Image with organic outline -->
					<div class="relative z-10 max-w-md lg:max-w-none">
						<img
							src="/templates/ice-cream/hero-icecream.jpg"
							alt="Ice Cream Waffle Bowl"
							class="w-full h-auto max-h-[560px] object-cover rounded-[3rem] shadow-2xl shadow-[#2B231D]/10 transform hover:scale-[1.02] transition-transform duration-500"
						/>
					</div>

					<!-- Floating Rating Card -->
					<Card class="absolute top-4 right-4 sm:right-8 bg-white/95 backdrop-blur shadow-xl border-none rounded-3xl p-5 z-20 flex flex-col items-center space-y-1">
						<span class="text-3xl font-black text-[#2B231D]">4.9</span>
						<div class="flex text-[#F5A623]">
							{#each Array(5) as _}
								<Star class="size-3.5 fill-[#F5A623]" />
							{/each}
						</div>
						<span class="text-[11px] font-semibold text-[#8C847A] tracking-wider uppercase">since 1995</span>
					</Card>
				</div>
			</div>
		</section>

		<!-- SECTION 2: FLAVORS CAROUSEL -->
		<section id="flavors" class="py-20 bg-white rounded-[3.5rem] shadow-sm">
			<div class="max-w-7xl mx-auto px-6">
				
				<!-- Section Header with Subtitle & Controls -->
				<div class="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
					<div>
						<span class="text-2xl font-['Shrikhand',cursive] text-[#FF6B8B] italic block mb-1">Explore</span>
						<h2 class="text-4xl font-extrabold text-[#2B231D] tracking-tight">Our Delicious Creations</h2>
					</div>

					<p class="text-sm text-[#7D766C] max-w-sm">
						Since our first loaf came out of the oven, we've been dedicated to bringing you fresh, wholesome, and delicious scoops.
					</p>
				</div>

				<!-- Flavors Horizontal Scroll / Grid -->
				<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
					{#each flavors as item}
						<div class="group flex flex-col items-center text-center p-6 rounded-[2.5rem] transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer" style="background-color: {item.color};">
							<div class="size-28 sm:size-32 rounded-full overflow-hidden shadow-md mb-5 border-4 border-white group-hover:scale-105 transition-transform">
								<img src={item.image} alt={item.name} class="w-full h-full object-cover" />
							</div>
							<Badge class="rounded-full bg-white/80 text-[#2B231D] font-bold text-[10px] uppercase tracking-wider mb-2 border-none shadow-xs">
								{item.badge}
							</Badge>
							<h3 class="font-bold text-base text-[#2B231D] group-hover:text-[#148A7E] transition-colors">{item.name}</h3>
						</div>
					{/each}
				</div>

				<!-- Carousel navigation buttons -->
				<div class="flex justify-center items-center gap-3 mt-10">
					<button class="p-3 rounded-full bg-[#F3EDE2] hover:bg-[#148A7E] hover:text-white transition-colors" aria-label="Previous">
						<ChevronLeft class="size-5" />
					</button>
					<div class="flex gap-1.5">
						<span class="size-2.5 rounded-full bg-[#FF6B8B]"></span>
						<span class="size-2.5 rounded-full bg-[#D8CEBE]"></span>
						<span class="size-2.5 rounded-full bg-[#D8CEBE]"></span>
					</div>
					<button class="p-3 rounded-full bg-[#F3EDE2] hover:bg-[#148A7E] hover:text-white transition-colors" aria-label="Next">
						<ChevronRight class="size-5" />
					</button>
				</div>
			</div>
		</section>

		<!-- SECTION 3: BENTO PROMO GRID ("Sweet Delight" & "20% Discount") -->
		<section id="shop" class="py-20 max-w-7xl mx-auto px-6">
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
				
				<!-- Promo Box 1: Sweet Delight (Teal Banner) -->
				<div class="lg:col-span-8 bg-[#148A7E] text-white rounded-[3rem] p-10 sm:p-14 relative overflow-hidden flex flex-col justify-between min-h-[420px] shadow-lg shadow-[#148A7E]/10">
					<div class="max-w-md space-y-4 z-10">
						<h3 class="text-4xl sm:text-5xl font-black uppercase tracking-tight leading-none text-[#FFD6E0]">
							SWEET<br />DELIGHT!
						</h3>
						<p class="text-white/85 text-sm sm:text-base font-medium">
							From warm treats to indulgent creations, we serve happiness in every single bite.
						</p>
					</div>

					<div class="z-10 pt-8">
						<Button class="rounded-full bg-white hover:bg-[#F3EDE2] text-[#148A7E] font-extrabold px-8 py-6 shadow-md">
							Order Now
						</Button>
					</div>

					<!-- Cutout Stick / Pop Image -->
					<div class="absolute -right-4 -bottom-8 w-64 sm:w-80 h-auto z-0 opacity-95">
						<img
							src="/templates/ice-cream/promo-popsicle.jpg"
							alt="Popsicle Delight"
							class="rounded-3xl transform rotate-12 shadow-2xl object-cover"
						/>
					</div>
				</div>

				<!-- Promo Box 2: 20% Discount (Pink Pastel Card) -->
				<div class="lg:col-span-4 bg-[#FFF0F3] border border-[#FFD6E0] rounded-[3rem] p-8 sm:p-10 flex flex-col justify-between shadow-sm">
					<div>
						<div class="flex items-baseline justify-between mb-6">
							<div>
								<span class="text-4xl font-black text-[#FF6B8B]">20%</span>
								<span class="text-xs font-bold text-[#8C847A] tracking-wider uppercase block">Discount</span>
							</div>
							<Badge class="bg-[#FF6B8B]/10 text-[#FF6B8B] border-none font-bold rounded-full px-3 py-1">Limited</Badge>
						</div>

						<!-- Mini Promo Products -->
						<div class="space-y-4">
							<div class="flex items-center justify-between p-3 rounded-2xl bg-white shadow-xs">
								<div class="flex items-center gap-3">
									<img src="/templates/ice-cream/doughnut.jpg" alt="Doughnut" class="size-12 rounded-xl object-cover" />
									<div>
										<p class="font-bold text-sm text-[#2B231D]">Fresh Doughnut</p>
										<span class="text-xs text-[#8C847A]">each</span>
									</div>
								</div>
								<span class="font-black text-[#FF6B8B] text-sm">$9.99</span>
							</div>

							<div class="flex items-center justify-between p-3 rounded-2xl bg-white shadow-xs">
								<div class="flex items-center gap-3">
									<img src="/templates/ice-cream/pretzel.jpg" alt="Choco Pretzel" class="size-12 rounded-xl object-cover" />
									<div>
										<p class="font-bold text-sm text-[#2B231D]">Choco Pretzel</p>
										<span class="text-xs text-[#8C847A]">each</span>
									</div>
								</div>
								<span class="font-black text-[#FF6B8B] text-sm">$9.99</span>
							</div>
						</div>
					</div>

					<Button class="w-full rounded-full bg-[#FF6B8B] hover:bg-[#e85877] text-white font-bold py-6 mt-6 shadow-md shadow-[#FF6B8B]/20">
						View All Deals
					</Button>
				</div>
			</div>
		</section>

		<!-- SECTION 4: VALUE PROPS / ICON BAR -->
		<section class="py-14 bg-[#F8F5EE] border-y border-[#EDE6D8]">
			<div class="max-w-7xl mx-auto px-6">
				<div class="grid grid-cols-2 md:grid-cols-4 gap-8">
					{#each valueProps as prop}
						<div class="flex flex-col items-center text-center space-y-3">
							<div class="size-14 rounded-full bg-white shadow-sm flex items-center justify-center text-[#148A7E]">
								<prop.icon class="size-6" />
							</div>
							<h4 class="font-bold text-base text-[#2B231D]">{prop.title}</h4>
							<p class="text-xs text-[#7D766C] max-w-[200px] leading-relaxed">{prop.desc}</p>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<section id="about" class="py-24 max-w-7xl mx-auto px-6">
			<div class="bg-[#FF6B8B] rounded-[3.5rem] p-10 sm:p-16 text-white grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden shadow-xl">
				<!-- Left Text -->
				<div class="lg:col-span-6 space-y-6">
					<span class="text-2xl font-['Shrikhand',cursive] text-[#FFF0F3] italic block">Our Story</span>
					<h2 class="text-4xl sm:text-5xl font-black tracking-tight leading-tight">
						Crafted with Passion, Served with Love
					</h2>
					<p class="text-white/90 font-medium leading-relaxed">
						What started as a small kitchen experiment is now your favorite ice cream destination. Every scoop represents hours of perfecting balanced sweetness and unmatched texture.
					</p>
					<Button class="rounded-full bg-white hover:bg-[#F3EDE2] text-[#FF6B8B] font-extrabold px-8 py-6 shadow-lg">
						Read Our Story
					</Button>
				</div>

				<!-- Right Team Photo -->
				<div class="lg:col-span-6">
					<div class="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
						<img
							src="/templates/ice-cream/our-story.jpg"
							alt="Ice cream crew"
							class="w-full h-[360px] object-cover"
						/>
					</div>
				</div>
			</div>
		</section>

		<!-- SECTION 6: REVIEWS / TESTIMONIALS -->
		<section class="py-20 bg-white rounded-[3.5rem] shadow-sm">
			<div class="max-w-7xl mx-auto px-6 text-center space-y-12">
				<div>
					<span class="text-2xl font-['Shrikhand',cursive] text-[#FF6B8B] italic block mb-1">Customer Favorites</span>
					<h2 class="text-4xl font-extrabold text-[#2B231D] tracking-tight">Loved by Thousands</h2>
				</div>

				<!-- Cards -->
				<div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
					{#each testimonials as review}
						<Card class="rounded-3xl bg-[#FDFBF7] border-none p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow">
							<div class="flex text-[#F5A623]">
								{#each Array(review.rating) as _}
									<Star class="size-4 fill-[#F5A623]" />
								{/each}
							</div>
							<p class="text-[#4A453E] italic font-medium leading-relaxed">
								"{review.quote}"
							</p>
							<div class="flex items-center gap-3 pt-4 border-t border-[#EDE6D8]">
								<Avatar class="size-10 rounded-full">
									<AvatarImage src={review.avatar} alt={review.name} />
									<AvatarFallback>{review.name.slice(0, 2)}</AvatarFallback>
								</Avatar>
								<span class="font-bold text-sm text-[#2B231D]">{review.name}</span>
							</div>
						</Card>
					{/each}
				</div>
			</div>
		</section>

		<!-- SECTION 7: COMMUNITY GALLERY -->
		<section class="py-20 max-w-7xl mx-auto px-6 space-y-8">
			<div class="text-center space-y-2">
				<span class="text-xs font-bold text-[#148A7E] tracking-widest uppercase">Sweet Moments</span>
				<h2 class="text-3xl font-extrabold text-[#2B231D]">Shared With Our Community</h2>
			</div>

			<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
				{#each gallery as imgUrl}
					<div class="group rounded-3xl overflow-hidden shadow-sm h-64 relative cursor-pointer">
						<img src={imgUrl} alt="Antix Moment" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
						<div class="absolute inset-0 bg-[#148A7E]/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
							<svg class="size-8 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
						</div>
					</div>
				{/each}
			</div>
		</section>

		<!-- SECTION 8: NEWSLETTER CTA -->
		<section class="py-16 max-w-4xl mx-auto px-6">
			<div class="bg-[#FFE8D6] rounded-[3rem] p-10 sm:p-14 text-center space-y-6 shadow-sm">
				<h2 class="text-3xl sm:text-4xl font-extrabold text-[#2B231D]">Stay Sweet with Scoop!</h2>
				<p class="text-[#6B645C] max-w-md mx-auto text-sm font-medium">
					Get updates on new flavors, special offers & sweet surprises straight to your inbox.
				</p>
				<div class="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
					<Input
						type="email"
						placeholder="Enter your email"
						bind:value={emailInput}
						class="rounded-full bg-white border-[#EDE6D8] px-6 py-6 text-sm text-[#2B231D] shadow-xs focus:ring-[#148A7E]"
					/>
					<Button class="w-full sm:w-auto rounded-full bg-[#148A7E] hover:bg-[#0f6b62] text-white font-bold px-8 py-6 shadow-md shadow-[#148A7E]/20">
						Subscribe
					</Button>
				</div>
			</div>
		</section>
	</main>

	<!-- FOOTER -->
	<footer class="bg-white border-t border-[#EDE6D8] pt-16 pb-12">
		<div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
			<!-- Brand col -->
			<div class="space-y-4">
				<span class="text-3xl font-black text-[#148A7E] font-['Shrikhand',cursive]">Scoop</span>
				<p class="text-xs text-[#7D766C] leading-relaxed">
					Scooping happiness one cone at a time since 1995. Crafted with fresh organic ingredients.
				</p>
			</div>

			<!-- Quick Links -->
			<div class="space-y-3">
				<h5 class="text-xs font-bold uppercase tracking-wider text-[#2B231D]">Quick Links</h5>
				<ul class="space-y-2 text-sm text-[#7D766C]">
					<li><a href="#about" class="hover:text-[#148A7E]">About Us</a></li>
					<li><a href="#flavors" class="hover:text-[#148A7E]">Our Flavors</a></li>
					<li><a href="#shop" class="hover:text-[#148A7E]">Shop</a></li>
					<li><a href="#recipes" class="hover:text-[#148A7E]">Recipes</a></li>
					<li><a href="#contact" class="hover:text-[#148A7E]">Contact</a></li>
				</ul>
			</div>

			<!-- Help & Support -->
			<div class="space-y-3">
				<h5 class="text-xs font-bold uppercase tracking-wider text-[#2B231D]">Help & Support</h5>
				<ul class="space-y-2 text-sm text-[#7D766C]">
					<li><a href="#faq" class="hover:text-[#148A7E]">FAQ</a></li>
					<li><a href="#shipping" class="hover:text-[#148A7E]">Shipping Info</a></li>
					<li><a href="#returns" class="hover:text-[#148A7E]">Returns</a></li>
					<li><a href="#terms" class="hover:text-[#148A7E]">Terms & Conditions</a></li>
					<li><a href="#privacy" class="hover:text-[#148A7E]">Privacy Policy</a></li>
				</ul>
			</div>

			<!-- Follow Us -->
			<div class="space-y-3">
				<h5 class="text-xs font-bold uppercase tracking-wider text-[#2B231D]">Follow Us</h5>
				<div class="flex gap-3 text-[#148A7E]">
					<a href="#instagram" class="p-2.5 rounded-full bg-[#F3EDE2] hover:bg-[#148A7E] hover:text-white transition-colors" aria-label="Instagram">
						<svg class="size-4 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
					</a>
					<a href="#facebook" class="p-2.5 rounded-full bg-[#F3EDE2] hover:bg-[#148A7E] hover:text-white transition-colors" aria-label="Facebook">
						<svg class="size-4 fill-current" viewBox="0 0 24 24"><path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.7 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z"/></svg>
					</a>
					<a href="#twitter" class="p-2.5 rounded-full bg-[#F3EDE2] hover:bg-[#148A7E] hover:text-white transition-colors" aria-label="Twitter">
						<svg class="size-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
					</a>
					<a href="#mail" class="p-2.5 rounded-full bg-[#F3EDE2] hover:bg-[#148A7E] hover:text-white transition-colors" aria-label="Email">
						<Mail class="size-4" />
					</a>
				</div>
			</div>
		</div>

		<div class="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-[#EDE6D8] text-center text-xs text-[#A8A196]">
			© 2026 Scoop Ice Cream Template. Built with Intinya UI.
		</div>
	</footer>
</div>
