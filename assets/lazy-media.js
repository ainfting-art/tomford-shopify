/**
 * lazy-media.js
 * - Auto-triggers deferred-media.loadContent() when videos scroll into view
 * - Handles autoplay videos that previously rendered eagerly
 */

class LazyMediaObserver {
  constructor() {
    // Observe videos 300px before they enter viewport
    this.videoObserver = new IntersectionObserver(
      this.#onVideoIntersect.bind(this),
      { rootMargin: '300px 0px', threshold: 0 }
    );

    // Observe sections 400px before they enter viewport
    this.sectionObserver = new IntersectionObserver(
      this.#onSectionIntersect.bind(this),
      { rootMargin: '400px 0px', threshold: 0 }
    );

    this.#init();
    this.#logStatus();
  }

  #logStatus() {
    console.log('🎬 LazyMediaObserver initialized');
    console.log('📦 Sections with data-lazy-section:', document.querySelectorAll('[data-lazy-section]').length);
    console.log('🎥 Deferred media with autoplay:', document.querySelectorAll('deferred-media[autoplay]').length);
    console.log('🖼️ Images with data-src:', document.querySelectorAll('img[data-src]').length);
    
    // Log details of lazy sections
    document.querySelectorAll('[data-lazy-section]').forEach((section, index) => {
      console.log(`  Section ${index + 1}:`, section.className, '| Images inside:', section.querySelectorAll('img').length);
    });
  }

  #init() {
    // Observe all deferred-media with autoplay (these had the duplicate render bug)
    document.querySelectorAll('deferred-media[autoplay]').forEach((media) => {
      // Only lazy-trigger if not already loaded
      if (!media.hasAttribute('data-media-loaded')) {
        this.videoObserver.observe(media);
        console.log('👀 Observing video:', media);
      }
    });

    // Observe sections for class-based reveal
    document.querySelectorAll('[data-lazy-section]').forEach((section) => {
      this.sectionObserver.observe(section);
      console.log('👀 Observing section:', section.className);
    });
  }

  /** @param {IntersectionObserverEntry[]} entries */
  #onVideoIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const media = entry.target;
      this.videoObserver.unobserve(media);
      
      console.log('▶️ Video entering viewport, loading:', media);

      // Use the existing DeferredMedia.loadContent() — no re-invention
      if (typeof media.loadContent === 'function') {
        media.loadContent(false); // false = don't steal focus
      }
    });
  }

  /** @param {IntersectionObserverEntry[]} entries */
  #onSectionIntersect(entries) {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const section = entry.target;
      this.sectionObserver.unobserve(section);
      section.setAttribute('data-section-loaded', 'true');
      
      console.log('📌 Section entering viewport:', section.className);

      // Trigger lazy images inside this section that may have data-src
      const lazyImages = section.querySelectorAll('img[data-src]');
      console.log(`  🖼️ Found ${lazyImages.length} lazy images to load`);
      
      lazyImages.forEach((img, index) => {
        console.log(`    Loading image ${index + 1}:`, img.dataset.src);
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        // Add loaded class for CSS transitions
        img.classList.add('lazy-image--loaded');
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
      });
      
      // Also check for video posters
      const videoPosters = section.querySelectorAll('.deferred-media__poster-image');
      console.log(`  🎬 Found ${videoPosters.length} video posters`);
    });
  }
}

// Run after DOM + custom elements are ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new LazyMediaObserver());
} else {
  new LazyMediaObserver();
}

// Add a global function to check lazy loading status
window.checkLazyLoading = function() {
  console.log('=== LAZY LOADING STATUS ===');
  console.log('Sections observed:', document.querySelectorAll('[data-lazy-section]').length);
  console.log('Sections loaded:', document.querySelectorAll('[data-section-loaded="true"]').length);
  console.log('Images with data-src:', document.querySelectorAll('img[data-src]').length);
  console.log('Images loaded:', document.querySelectorAll('.lazy-image--loaded').length);
  console.log('Deferred media loaded:', document.querySelectorAll('deferred-media[data-media-loaded="true"]').length);
  console.log('===========================');
};

console.log('💡 Run "checkLazyLoading()" in console to see lazy loading status');