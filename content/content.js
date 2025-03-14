// Add animation styles
const animationStyle = document.createElement('style');
animationStyle.textContent = `
  @keyframes catBlockExpand {
    from { transform: scale(0.6); opacity: 0.2; }
    to { transform: scale(1); opacity: 0.9; }
  }
  
  @keyframes catBlockFadeIn {
    from { opacity: 0; transform: scale(0.8); }
    to { opacity: 1; transform: scale(1); }
  }
  
  @keyframes catBlockFadeOut {
    from { opacity: 1; }
    to { opacity: 0; }
  }
  
  @keyframes catBlockFlip {
    from { transform: rotateY(0deg); }
    to { transform: rotateY(180deg); }
  }
  
  /* Faster animation durations */
  @keyframes rippleEffect {
    0% {
      transform: scale(0);
      opacity: 0.7;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }
  
  /* Faster scan animation */
  @keyframes crossTileScan {
    0% { 
      opacity: 0;
      transform: scale(0.1);
      filter: brightness(1);
    }
    30% {
      opacity: 0.9;
      filter: brightness(1.5);
    }
    100% { 
      opacity: 0;
      transform: scale(1.2);
      filter: brightness(1);
    }
  }
  
  @keyframes crosshairPulse {
    0%, 100% { opacity: 0.6; filter: brightness(1); }
    50% { opacity: 1; filter: brightness(1.3); }
  }
  
  .catblock-animation-container {
    box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    border-radius: 4px;
    animation: catBlockExpand 0.5s cubic-bezier(0.19, 1, 0.22, 1) forwards;
  }
  
  .catblock-logo-container {
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  
  .catblock-flip-container {
    perspective: 1000px;
  }
  
  .catblock-scan-container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    pointer-events: none;
    z-index: 3;
    overflow: hidden;
  }
  
  .catblock-ripple {
    position: absolute;
    border: 1px solid rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    width: 20px;
    height: 20px;
  }
  
  .catblock-crosshair {
    position: absolute;
    width: 20px;
    height: 20px;
    opacity: 0;
  }
  
  .catblock-crosshair::before,
  .catblock-crosshair::after {
    content: '';
    position: absolute;
    background-color: rgba(255, 255, 255, 0.9);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  }
  
  .catblock-crosshair::before {
    width: 1px;
    height: 100%;
    left: 50%;
    transform: translateX(-50%);
  }
  
  .catblock-crosshair::after {
    width: 100%;
    height: 1px;
    top: 50%;
    transform: translateY(-50%);
  }
  
  .catblock-scan-grid {
    position: absolute;
    display: grid;
    opacity: 0;
    transform-origin: center;
  }
  
  .catblock-scan-grid .catblock-crosshair {
    box-shadow: 0 0 4px rgba(255, 255, 255, 0.5);
  }
  
  /* MODIFIED: Only apply opacity fixes to completed elements */
  .catblock-wrapper.animation-completed {
    opacity: 1 !important;
  }
  
  .catblock-wrapper.animation-completed .catblock-animation-container {
    background-color: #000000 !important;
    opacity: 1 !important;
  }
  
  .catblock-wrapper.animation-completed .catblock-flip-back {
    opacity: 1 !important;
    background-color: #000000 !important;
  }
  
  .catblock-wrapper.animation-completed .catblock-image {
    opacity: 1 !important;
    filter: none !important;
  }
  
  /* Simple fade-in animation for the cat image */
  @keyframes simpleFadeIn {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  /* Make sure the simple container is always fully opaque when completed */
  .simple-cat-container {
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    border-radius: 3px;
  }
  
  .animation-completed .simple-cat-container {
    opacity: 1 !important;
    background-color: black !important;
  }
  
  .animation-completed .simple-cat-container img {
    opacity: 1 !important;
  }
  
  /* Cat engineer visibility fixes - more targeted to elements only */
  .catblock-logo-container.active img {
    opacity: 1 !important;
    filter: drop-shadow(1px 1px 3px rgba(0,0,0,0.7)) !important;
  }
  
  .catblock-logo-container.active div {
    opacity: 1 !important;
    color: #ffffff !important;
  }
`;
document.head.appendChild(animationStyle);

// Basic ad selectors - reduced and simplified
const BASE_SELECTORS = [
  '.ad', '.ads', '.adsbygoogle', 
  '[id*="google_ads"]', 
  '[class*="banner-ad"]'
];

// Zhihu-specific ad selectors
const ZHIHU_SELECTORS = [
  '.TopstoryItem--advertCard',
  '.Pc-card.Card--borderLess.TopstoryItem-isRecommend',
  '.Pc-feedAd',
  '[data-za-extra-module*="ad"]',
  '.RichContent-actions [data-tooltip="广告"]',
  '.KfeCollection-PcCollegeCard-item',
  '.AdvertImg',
  '.Pc-word',
  '.Banner-link',
  '.RichText-ADLinkCardContainer',
  '[data-mcn-provider]'
];

// Baidu-specific ad selectors
const BAIDU_SELECTORS = [
  '#content_right > [data-placeid]',
  '.ec-tuiguang',
  '.ec_wise_ad',
  '[cmatchid]',
  '[ut="click"]'
];

// Cat image storage - using more images
const CAT_IMAGES = {
  // Wide images (suitable for banner ads)
  wide: ['cat12.jpg', 'cat22.jpg', 'cat23.jpg', 'cat24.jpg'],
  // Tall images (suitable for sidebar ads)
  tall: ['cat4.jpg', 'cat7.jpg', 'cat8.jpg',  'cat11.jpg', 'cat19.jpg','cat5.jpg'],
  // Square images (suitable for general ads)
  square: ['cat3.jpg', 'cat13.jpg', 'cat14.jpg', 'cat15.jpg', 
            'cat18.jpg', 'cat20.jpg', 'cat21.jpg']
};

// Store processed elements
const processedElements = new WeakSet();

// Get settings
let isEnabled = true;
let easyListRules = [];

// Add YouTube-specific ad selectors
const YOUTUBE_SELECTORS = [
  'ytd-display-ad-renderer',
  'ytd-in-feed-ad-layout-renderer',
  '.ytp-ad-overlay-container',
  '.ytp-ad-text-overlay',
  'ytd-promoted-video-renderer',
  '.ytd-promoted-sparkles-web-renderer',
  '.ytd-display-ad-renderer',
  '.ytd-ad-slot-renderer',
  '[id="player-ads"]',
  '.ytd-video-masthead-ad-v3-renderer',
  'ytd-promoted-sparkles-text-search-renderer',
  '[layout="display-ad-layout-right-rail"]',
  '.ytd-statement-banner-renderer'
];

// Track images already used on the current page
const usedImagesOnPage = new Set();

// Debug helper function
function debugImageLoading(imageUrl) {
  const testImg = new Image();
  testImg.onload = () => console.log('✅ Image loaded successfully:', imageUrl);
  testImg.onerror = () => console.error('❌ Image loading failed:', imageUrl);
  testImg.src = imageUrl;
}

// Main function to replace ads with cat images
function replaceWithCat(adElement) {
  // Check if element has already been processed
  if (adElement.getAttribute('data-catblock-processed') === 'true' || 
      adElement.querySelector('.catblock-animation-container') ||
      adElement.closest('[data-catblock-processed="true"]')) {
    console.log('Element already processed, skipping');
    return;
  }

  // Mark as processed immediately
  adElement.setAttribute('data-catblock-processed', 'true');
  
  // Clean up any existing animation containers
  const existingContainers = adElement.querySelectorAll('.catblock-animation-container, .catblock-wrapper');
  existingContainers.forEach(container => container.remove());
  
  // Check if this is a YouTube player ad
  if (isYouTubePlayerAd(adElement)) {
    console.log('Skipping YouTube player ad to maintain skip button functionality');
    return;
  }
  
  // Get ad element dimensions
  const rect = adElement.getBoundingClientRect();
  const width = Math.max(rect.width, 50);
  const height = Math.max(rect.height, 50);
  
  if (width < 50 || height < 50 || width > 1500 || height > 1500) return;
  
  try {
    // Calculate aspect ratio
    const adRatio = width / height;
    console.log(`Ad ratio: ${adRatio.toFixed(2)}, Size: ${width}x${height}`);
    
    // Choose appropriate cat image based on ratio
    let randomCat;
    
    if (Object.keys(catImageRatios).length === 0) {
      console.log("Image ratios not yet calculated, using fallback method");
      
      // Fallback based on fixed thresholds
      let categoryName = 'square';
      let availableImages = CAT_IMAGES.square;
      
      if (adRatio > 2.0) {
        categoryName = 'wide';
        availableImages = CAT_IMAGES.wide;
      } else if (adRatio < 0.5) {
        categoryName = 'tall';
        availableImages = CAT_IMAGES.tall;
      }
      
      // Find unused images
      const unusedImages = availableImages.filter(img => !usedImagesOnPage.has(img));
      
      if (unusedImages.length > 0) {
        // Randomly select an unused image
        randomCat = unusedImages[Math.floor(Math.random() * unusedImages.length)];
        usedImagesOnPage.add(randomCat);
        console.log('Using new image:', randomCat);
      } else {
        // If all images used, select any image
        randomCat = availableImages[Math.floor(Math.random() * availableImages.length)];
        console.log('All images used, reusing:', randomCat);
      }
    } else {
      // Find best match based on aspect ratio
      console.log("Using precise ratio matching");
      
      let bestMatch = null;
      let smallestDifference = Infinity;
      
      // Get all available images
      const allImages = [
        ...CAT_IMAGES.wide, 
        ...CAT_IMAGES.tall, 
        ...CAT_IMAGES.square
      ];
      
      // Check unused images first
      const unusedImages = allImages.filter(img => !usedImagesOnPage.has(img));
      const imagesToCheck = unusedImages.length > 0 ? unusedImages : allImages;
      
      // Find closest aspect ratio match
      imagesToCheck.forEach(imageName => {
        if (catImageRatios[imageName]) {
          const ratioDifference = Math.abs(catImageRatios[imageName] - adRatio);
          if (ratioDifference < smallestDifference) {
            smallestDifference = ratioDifference;
            bestMatch = imageName;
          }
        }
      });
      
      if (bestMatch) {
        console.log(`Found best match for ratio ${adRatio.toFixed(2)}: ${bestMatch} (ratio: ${catImageRatios[bestMatch].toFixed(2)})`);
        randomCat = bestMatch;
        usedImagesOnPage.add(bestMatch);
      } else {
        // Fallback to random selection if no match found
        console.log("No best match found, using random image");
        randomCat = allImages[Math.floor(Math.random() * allImages.length)];
      }
    }
    
    const catImageUrl = chrome.runtime.getURL(`cats_images/${randomCat}`);
    console.log('Loading image:', catImageUrl);
    
    // Create animation container
    const animContainer = document.createElement('div');
    animContainer.className = 'catblock-animation-container';
    animContainer.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      background-color: rgba(0, 0, 0, 0.35);
      position: absolute;
      top: 0;
      left: 0;
      z-index: 888;
      overflow: hidden;
      box-sizing: border-box;
      transition: background-color 0.8s ease;
    `;
    
    // 创建扫描特效容器
    const scanContainer = document.createElement('div');
    scanContainer.className = 'catblock-scan-container';
    scanContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 3;
    `;
    
    // 创建平铺十字网格函数
    const createCrossGrid = (gridSize) => {
      // 确定网格的行列数
      const rows = Math.ceil(height / gridSize);
      const cols = Math.ceil(width / gridSize);
      
      const grid = document.createElement('div');
      grid.className = 'catblock-scan-grid';
      grid.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(${cols}, 1fr);
        grid-template-rows: repeat(${rows}, 1fr);
        gap: 0px;
        transform-origin: center center;
      `;
      
      // 创建网格中的小十字 - 添加光芒效果
      for (let i = 0; i < rows * cols; i++) {
        const cross = document.createElement('div');
        cross.className = 'catblock-crosshair';
        cross.style.cssText = `
          position: relative;
          width: 10px;
          height: 10px;
          opacity: 0.7;
          transform: scale(0.8);
          margin: auto;
          filter: brightness(1.2); /* 增加亮度 */
        `;
        grid.appendChild(cross);
      }
      
      return grid;
    };
    
    // 添加扫描效果容器到动画容器
    animContainer.appendChild(scanContainer);
    
    // 创建猫咪工程师容器
    const catLogoContainer = document.createElement('div');
    catLogoContainer.className = 'catblock-logo-container';
    catLogoContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 2;
      opacity: 0;
      transform: scale(0.8);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      background-color: rgba(0, 0, 0, 0.45); /* Darker background for better contrast */
    `;
    
    // 添加工程猫咪图片和文字
    const catLogo = document.createElement('img');
    catLogo.src = chrome.runtime.getURL('images/cat_in_work.png');
    catLogo.style.cssText = `
      width: ${Math.min(width, height) * 0.65}px;
      max-height: ${height * 0.75}px;
      object-fit: contain;
      margin-bottom: 6px;
      filter: drop-shadow(1px 1px 2px rgba(0,0,0,0.4));
    `;
    
    // 文字设计保持不变
    const text = document.createElement('div');
    text.textContent = "cat is working...";
    text.style.cssText = `
      font-family: 'Segoe UI', 'Tahoma', sans-serif;
      font-size: ${Math.min(width, height) * 0.09}px;
      font-weight: 600;
      color: #e0e0e0;
      text-align: center;
      max-width: 90%;
      letter-spacing: 1.2px;
      text-transform: uppercase;
      text-shadow: 0px 1px 2px rgba(0,0,0,0.5);
      border-bottom: 1px solid rgba(255,255,255,0.15);
      padding-bottom: 2px;
    `;
    
    catLogoContainer.appendChild(catLogo);
    catLogoContainer.appendChild(text);
    animContainer.appendChild(catLogoContainer);
    
    // 创建翻转容器
    const flipContainer = document.createElement('div');
    flipContainer.className = 'catblock-flip-container';
    flipContainer.style.cssText = `
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      perspective: 1000px;
      transform-style: preserve-3d;
      opacity: 0;
      transition: transform 0.8s, opacity 0.5s;
      z-index: 5;
    `;
    
    // 创建前面板
    const frontFace = document.createElement('div');
    frontFace.className = 'catblock-flip-front';
    frontFace.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
    `;
    
    // 创建猫咪图片后面板 - 使用微妙的边框效果
    const backFace = document.createElement('div');
    backFace.className = 'catblock-flip-back';
    backFace.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      transform: rotateY(180deg);
      background-color: black;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 3px;
      opacity: 0;
      transition: opacity 0.4s ease;
      /* 微妙的边框效果 */
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
    `;
    
    // 创建猫咪图片容器
    const catImageContainer = document.createElement('div');
    catImageContainer.style.cssText = `
      width: 100%;
      height: 100%;
      position: relative;
      overflow: hidden;
    `;
    
    // 创建猫咪图片 - 不添加额外边框
    const catImage = document.createElement('img');
    catImage.className = 'catblock-image';
    catImage.src = catImageUrl;
    catImage.style.cssText = `
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      opacity: 1 !important; /* Force full opacity */
    `;
    
    // 添加到DOM
    catImageContainer.appendChild(catImage);
    backFace.appendChild(catImageContainer);
    flipContainer.appendChild(frontFace);
    flipContainer.appendChild(backFace);
    animContainer.appendChild(flipContainer);
    
    // 叠加到广告元素上
    adElement.style.position = 'relative';
    
    // 创建DOM时使用覆盖而非添加方式，防止叠加
    const wrapper = document.createElement('div');
    wrapper.className = 'catblock-wrapper';
    wrapper.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 888;
    `;
    
    // 确保只添加一次
    if (!adElement.querySelector('.catblock-wrapper')) {
      // 为 Bilibili 等嵌套广告设置特殊处理
      if (isBilibiliAd(adElement)) {
        // 对 Bilibili 广告特殊处理，清空内容再添加
        const originalContent = adElement.innerHTML;
        adElement.innerHTML = '';
        wrapper.appendChild(animContainer);
        adElement.appendChild(wrapper);
        
        // 递归标记所有子元素为已处理
        markAllChildrenAsProcessed(adElement);
      } else {
        // 正常添加，不清空内容
        wrapper.appendChild(animContainer);
        adElement.appendChild(wrapper);
      }
    }
    
    // Replace the animation sequence part in the replaceWithCat function
    setTimeout(() => {
      // Run first scan animation cycle
      const runScanCycle = (isFirstCycle) => {
        // Add ripple effect - faster animation
        const ripple = document.createElement('div');
        ripple.className = 'catblock-ripple';
        ripple.style.animation = 'rippleEffect 1.4s ease-out forwards'; // Faster: 2.2s -> 1.4s
        scanContainer.appendChild(ripple);
        
        // Add scanning grid with faster animation
        const gridSize = Math.min(width, height) / 20;
        const grid = createCrossGrid(gridSize);
        scanContainer.appendChild(grid);
        grid.style.animation = 'crossTileScan 1200ms ease-out forwards'; // Faster: 1800ms -> 1200ms
        
        // When cycle is done, either start second cycle or show cat engineer
        setTimeout(() => {
          // Instead of removing elements, just overlap - no gap between animations
          if (isFirstCycle) {
            // Start second cycle immediately - no delay
            runScanCycle(false);
            
            // Remove first cycle elements slightly after second cycle starts
            setTimeout(() => {
              ripple.remove();
              grid.remove();
            }, 200); // Small delay so animations overlap slightly
          } else {
            // After second cycle, clean up and show cat engineer
            ripple.remove();
            grid.remove();
            
            // Show cat engineer right away
            catLogoContainer.style.opacity = '1';
            catLogoContainer.style.transform = 'scale(1)';
            catLogoContainer.classList.add('active');
            
            // Ensure cat logo image and text are fully opaque
            catLogo.style.opacity = '1';
            text.style.opacity = '1';
            
            // Phase 2: Transition to cat image after delay
            setTimeout(() => {
              // Hide engineer with a nice fade out
              catLogoContainer.style.opacity = '0';
              catLogoContainer.style.transform = 'scale(0.9)';
              
              // Phase 3: Simple fade-in animation for the cat image
              setTimeout(() => {
                // Remove the complex flip container approach
                flipContainer.remove();
                
                // Create a simple direct container for the cat image
                const simpleCatContainer = document.createElement('div');
                simpleCatContainer.className = 'simple-cat-container';
                simpleCatContainer.style.cssText = `
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 100%;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background-color: black;
                  opacity: 0;
                  transition: opacity 0.5s ease-in;
                  overflow: hidden;
                  z-index: 10;
                `;
                
                // Create the cat image with a subtle scale animation
                const finalCatImage = document.createElement('img');
                finalCatImage.src = catImageUrl;
                finalCatImage.style.cssText = `
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  transform: scale(0.95);
                  transition: transform 0.7s ease-out;
                `;
                
                // Add to the DOM
                simpleCatContainer.appendChild(finalCatImage);
                animContainer.appendChild(simpleCatContainer);
                
                // Start the fade-in animation
                setTimeout(() => {
                  simpleCatContainer.style.opacity = '1';
                  finalCatImage.style.transform = 'scale(1)';
                  
                  // Add class for CSS rules
                  wrapper.classList.add('animation-completed');
                  
                  // Mark processing as complete
                  chrome.runtime.sendMessage({ action: 'incrementCount' });
                }, 100);
              }, 300);
            }, 1800); // Keep the cat engineer display time the same
          }
        }, 1200); // Faster cycle: 1800ms -> 1200ms
      };
      
      // Start the first scan cycle
      runScanCycle(true);
    }, 200);
  } catch (e) {
    console.error('Error replacing element:', e);
    adElement.removeAttribute('data-catblock-processed');
  }
}

// Check if element is a YouTube player ad
function isYouTubePlayerAd(element) {
  // Check if in player
  const isInPlayer = element.closest('.html5-video-player') !== null;
  
  // Check if related to skip ad button
  const hasSkipButton = element.querySelector('.ytp-ad-skip-button') !== null;
  
  // Check if video overlay ad
  const isAdOverlay = element.classList.contains('ytp-ad-overlay-container') ||
                     element.classList.contains('ytp-ad-overlay-slot');
  
  // Check if playback related element
  const isPlaybackElement = element.classList.contains('ytp-ad-module') ||
                          element.classList.contains('ytp-ad-player-overlay');
  
  // Skip replacement if it's a player-related ad element
  return isInPlayer || hasSkipButton || isAdOverlay || isPlaybackElement;
}

function initializeYouTubeSpecific() {
  // Only handle skip button and process non-player ads
  const checkVideoAds = () => {
    const videoAds = document.querySelectorAll('.html5-video-player.ad-showing');
    if (videoAds.length > 0) {
      console.log('检测到YouTube视频广告，尝试跳过');
      
      // Only try to click the skip ad button, don't modify other player content
      const skipButton = document.querySelector('.ytp-ad-skip-button');
      if (skipButton) {
        skipButton.click();
        chrome.runtime.sendMessage({ action: 'incrementCount' });
      }
    }
    
    // Only find non-player ad elements on the page
    findYouTubeNonPlayerAds();
  };
  
  // Check video ads every 2 seconds
  setInterval(checkVideoAds, 2000);
  
  // Immediately perform an initial check
  setTimeout(checkVideoAds, 1000);
}

function findYouTubeNonPlayerAds() {
  const youtubeAdSelectors = [
    'ytd-display-ad-renderer',
    'ytd-ad-slot-renderer',
    'ytd-in-feed-ad-layout-renderer',
    'ytd-promoted-video-renderer',
    'ytd-compact-promoted-video-renderer',
    '[id="masthead-ad"]',
    '.ytd-watch-next-secondary-results-renderer[display-ad-renderer]',
    '.ytd-rich-item-renderer[is-display-ad]',
    '[class*="ytd-promoted"]',
    '[layout="display-ad-layout-right-rail"]'
  ];
  
  const selector = youtubeAdSelectors.join(',');
  const adElements = document.querySelectorAll(selector);
  
  let count = 0;
  adElements.forEach(element => {
    if (!isYouTubePlayerAd(element) && !processedElements.has(element)) {
      const rect = element.getBoundingClientRect();
      if (rect.width >= 50 && rect.height >= 50 && isElementVisible(element)) {
        replaceWithCat(element);
        processedElements.add(element);
        count++;
      }
    }
  });
  
  if (count > 0) {
    console.log(`特定查找到 ${count} 个 YouTube 非播放器广告元素`);
  }
}

// 在初始化函数中添加图片比例计算代码
let catImageRatios = {}; // 存储每张图片的实际宽高比

// Calculate aspect ratios for all cat images
function calculateImageRatios() {
  console.log("Starting to calculate actual image ratios...");
  
  // Collect all images
  const allImages = [
    ...CAT_IMAGES.wide,
    ...CAT_IMAGES.tall, 
    ...CAT_IMAGES.square
  ];
  
  // Create Image object for each image and get its aspect ratio
  allImages.forEach(imageName => {
    const img = new Image();
    const imageUrl = chrome.runtime.getURL(`cats_images/${imageName}`);
    
    img.onload = () => {
      const ratio = img.width / img.height;
      catImageRatios[imageName] = ratio;
      console.log(`Image ${imageName} aspect ratio: ${ratio.toFixed(2)}`);
    };
    
    img.onerror = () => {
      console.error(`Cannot load image: ${imageName}`);
    };
    
    img.src = imageUrl;
  });
}

async function initialize() {
  const settings = await chrome.storage.local.get('enabled');
  isEnabled = settings.enabled !== false;
  
  // EasyList 
  const rulesData = await chrome.runtime.sendMessage({ action: 'getRules' });
  if (rulesData && rulesData.rules) {
    easyListRules = rulesData.rules;
  }
  
  const catWorkerUrl = chrome.runtime.getURL('images/cat_in_work.png');
  debugImageLoading(catWorkerUrl);
  
  // Test if a few random cat images are accessible
  const testWideImage = chrome.runtime.getURL(`cats_images/${CAT_IMAGES.wide[0]}`);
  const testTallImage = chrome.runtime.getURL(`cats_images/${CAT_IMAGES.tall[0]}`);
  debugImageLoading(testWideImage);
  debugImageLoading(testTallImage);
  
  calculateImageRatios();
  
  if (isEnabled) {
    // Use setTimeout to delay execution, avoid page loading lag
    setTimeout(() => {
      findAndReplaceAds();
      
      // Add special handling based on current website
      const hostname = window.location.hostname;
      if (hostname.includes('youtube.com')) {
        initializeYouTubeSpecific();
      }
    }, 1000);
  }
  
  // Set up a more efficient MutationObserver
  setupMutationObserver();
}

// Add Bilibili-specific ad selectors
const BILIBILI_SELECTORS = [
  // Video sidebar ad cards
  '.video-card-ad-small-inner',
  '[data-target-url*="cm.bilibili.com"]',
  '.ad-report',
  // Right side ads
  '[data-loc-id]',
  '.ad-floor-cover img[src*="hdslb.com/bfs/sycp"]',
  // Feed ads
  '.bili-video-card__info--ad',
  '.eva-extension-card',
  // Top banner ads
  '#slide_ad',
  // Ads above danmaku
  '.bilibili-player-promote',
  // Homepage carousel ads
  '.adblock-tips',
  '.carousel-item a[href*="cm.bilibili.com"]',
  // Search page ads
  '.bili-video-card__info--ad',
  // Post-video ads
  '.bilibili-player-dm-tip-container',
  // General ad markers
  '[class*="ad-"]',
  '[class*="bili-ads"]'
];

function findAndReplaceAds() {
  if (!isEnabled) return;
  
  let selectors = [...BASE_SELECTORS];
  
  const hostname = window.location.hostname;
  
  if (hostname.includes('zhihu.com')) {
    console.log('检测到知乎网站，应用特定规则');
    selectors = selectors.concat(ZHIHU_SELECTORS);
  } else if (hostname.includes('baidu.com')) {
    console.log('检测到百度网站，应用特定规则');
    selectors = selectors.concat(BAIDU_SELECTORS);
  } else if (hostname.includes('youtube.com')) {
    console.log('检测到YouTube网站，应用特定规则');
    selectors = selectors.concat(YOUTUBE_SELECTORS);
  } else if (hostname.includes('bilibili.com')) {
    console.log('检测到Bilibili网站，应用特定规则');
    selectors = selectors.concat(BILIBILI_SELECTORS);
  }
  
  try {
    const selector = selectors.join(',');
    const adElements = document.querySelectorAll(selector);
    
    let count = 0;
    
    adElements.forEach(element => {
      // Check if element has already been processed
      if (element.getAttribute('data-catblock-processed') === 'true' || 
          processedElements.has(element) ||
          element.closest('[data-catblock-processed="true"]')) {
        return;
      }
      
      // Filter out too small or invisible elements
      const rect = element.getBoundingClientRect();
      if (rect.width < 50 || rect.height < 50 || !isElementVisible(element)) {
        return;
      }
      
      replaceWithCat(element);
      processedElements.add(element);
      count++;
    });
    
    if (count > 0) {
      console.log(`本轮替换了 ${count} 个广告元素`);
    }
  } catch (error) {
    console.error('选择器处理错误:', error);
  }
}

// Check if element is visible
function isElementVisible(el) {
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
}

// Modify MutationObserver to prevent excessive triggering
function setupMutationObserver() {
  const debounceTime = 2000;
  let debounceTimer;
  
  let isProcessing = false;
  let pendingMutations = false;
  
  const observer = new MutationObserver(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    if (isProcessing) {
      pendingMutations = true;
      return;
    }
    
    debounceTimer = setTimeout(() => {
      if (!isEnabled) return;
      
      isProcessing = true;
      
      findAndReplaceAds();
      
      setTimeout(() => {
        isProcessing = false;
        
        if (pendingMutations) {
          pendingMutations = false;
          findAndReplaceAds();
        }
      }, 3000); 
      
    }, debounceTime);
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: false
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'toggleState') {
    isEnabled = message.enabled;
    
    if (isEnabled) {
      setTimeout(findAndReplaceAds, 500);
    }
  }
});

function isBilibiliAd(element) {
  return window.location.hostname.includes('bilibili.com') && 
         (element.classList.contains('video-card-ad-small-inner') || 
          element.matches('[data-target-url*="cm.bilibili.com"]') ||
          element.classList.contains('ad-report') ||
          element.hasAttribute('data-loc-id'));
}

// Recursively mark all child elements as processed
function markAllChildrenAsProcessed(element) {
  const children = element.querySelectorAll('*');
  children.forEach(child => {
    child.setAttribute('data-catblock-processed', 'true');
    processedElements.add(child);
  });
}

if (document.readyState === 'complete') {
  initialize();
} else {
  window.addEventListener('load', initialize);
}

function detectDynamicAds() {
  // Look for iframes with ad-like content
  const iframes = document.querySelectorAll('iframe');
  iframes.forEach(iframe => {
    try {
      // Check iframe src or content patterns
      if (iframe.src.includes('ads') || 
          iframe.src.includes('sponsor') ||
          iframe.width > 300 && iframe.height > 250) {
        // Potential ad found
        processAdCandidate(iframe);
      }
    } catch (e) {
      // Handle cross-origin restrictions
    }
  });
}

// Create a reusable function for the scanning animation
function runScanningAnimation(container, width, height, onComplete) {
  // Add ripple effect
  const ripple = document.createElement('div');
  ripple.className = 'catblock-ripple';
  ripple.style.animation = 'rippleEffect 2.2s ease-out forwards';
  container.appendChild(ripple);
  
  // Add scanning grid
  const gridSize = Math.min(width, height) / 20;
  const grid = createCrossGrid(gridSize);
  container.appendChild(grid);
  grid.style.animation = 'crossTileScan 1800ms ease-out forwards';
  
  // Clean up after animation and call callback
  setTimeout(() => {
    ripple.remove();
    grid.remove();
    if (onComplete) onComplete();
  }, 1800);
}

// Function to show cat engineer
function showCatEngineer() {
  // Show cat engineer with full opacity for text and image only
  catLogoContainer.style.opacity = '1';
  catLogoContainer.style.transform = 'scale(1)';
  catLogoContainer.classList.add('active');
  
  // Ensure cat logo image and text are fully opaque with direct styling
  catLogo.style.opacity = '1';
  text.style.opacity = '1';
  
  // Phase 2: Transition to cat image (after delay)
  setTimeout(() => {
    // Hide engineer with a nice fade out
    catLogoContainer.style.opacity = '0';
    catLogoContainer.style.transform = 'scale(0.9)';
    
    // Phase 3: Simple fade-in animation for the cat image
    setTimeout(() => {
      // Remove the complex flip container approach
      flipContainer.remove();
      
      // Create a simple direct container for the cat image
      const simpleCatContainer = document.createElement('div');
      simpleCatContainer.className = 'simple-cat-container';
      simpleCatContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: black;
        opacity: 0;
        transition: opacity 0.5s ease-in;
        overflow: hidden;
        z-index: 10;
      `;
      
      // Create the cat image with a subtle scale animation
      const finalCatImage = document.createElement('img');
      finalCatImage.src = catImageUrl;
      finalCatImage.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: cover;
        transform: scale(0.95);
        transition: transform 0.7s ease-out;
      `;
      
      // Add to the DOM
      simpleCatContainer.appendChild(finalCatImage);
      animContainer.appendChild(simpleCatContainer);
      
      // Start the fade-in animation
      setTimeout(() => {
        simpleCatContainer.style.opacity = '1';
        finalCatImage.style.transform = 'scale(1)';
        
        // Add class for CSS rules
        wrapper.classList.add('animation-completed');
        
        // Mark processing as complete
        chrome.runtime.sendMessage({ action: 'incrementCount' });
      }, 100);
    }, 300);
  }, 1800);
} 