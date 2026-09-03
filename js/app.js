const nav = document.querySelector('nav');

window.addEventListener('scroll', () => {
    if(window.scrollY > 50){
        nav.style.background = 'rgba(0,0,0,0.88)';
    }else{
        nav.style.background = 'rgba(0,0,0,0.45)';
    }
});

const heroVideo = document.getElementById('heroVideo');

const videos = [
    'videos/video1.mp4',
    'videos/video2.mp4'
];

const randomVideo = videos[Math.floor(Math.random() * videos.length)];

heroVideo.src = randomVideo;
heroVideo.load();

heroVideo.addEventListener('loadeddata', () => {
    heroVideo.classList.add('loaded');

    heroVideo.play().catch(error => {
        console.log('Autoplay blocked or video failed:', randomVideo, error);
    });
});

heroVideo.addEventListener('error', () => {
    console.log('Video failed to load:', randomVideo);
    heroVideo.src = 'videos/video1.mp4';
    heroVideo.load();
});

const imageTrack = document.getElementById('imageTrack');

const stories = [
    {
        image:'images/magnolia-square.jpg',
        tag:'FIELD NOTE 007',
        title:'MAGNOLIA SQUARE',
        sub:'Every intersection holds a story.',
        link:'journal/magnolia-square.html'
    },
    {
        image:'images/imperial-hwy.jpg',
        tag:'FIELD NOTE 008',
        title:'IMPERIAL HIGHWAY',
        sub:'A route carved by systems.',
        link:'journal/imperial-highway.html'
    },
    {
        image:'images/main-street.jpg',
        tag:'FIELD NOTE 009',
        title:'MAIN STREET',
        sub:'The core. The origin. The return point.',
        link:'journal/main-street.html'
    },
    {
        image:'images/api-spacesuit.jpg',
        tag:'SYSTEM FILE 001',
        title:'API IS THE PRODUCT',
        sub:'Why infrastructure became the first THUG CODING drop.',
        link:'https://blog.thugcoding.com/post/18/'
    },
    {
        image:'images/bridge.jpg',
        tag:'FIELD NOTE 003',
        title:'THE BRIDGE WALL',
        sub:'Transit, visibility, and cultural infrastructure.',
        link:'journal/the-bridge-wall.html'
    },
    {
        image:'images/technology.jpg',
        tag:'MANIFESTO 005',
        title:'YOU ARE TECHNOLOGY',
        sub:'The body, the mind, the code, the uniform.',
        link:'journal/you-are-technology.html'
    },
    {
        image:'images/serverradio.jpg',
        tag:'SYSTEM FILE 002',
        title:'THUG CODING RADIO',
        sub:'Radio infrastructure. Built from the server up.',
        link:'https://blog.thugcoding.com/post/19/'
    },

];

function shuffleArray(array){
    for(let i = array.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

shuffleArray(stories);

function createStoryCards(){
    imageTrack.innerHTML = '';

    [...stories, ...stories].forEach(item => {
        const card = document.createElement('a');
        card.classList.add('image-item');
        card.href = item.link;
        card.target = "_blank";
        card.rel = "noopener noreferrer";

        card.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="image-content">
                <div class="image-tag">${item.tag}</div>
                <div class="image-title">${item.title}</div>
                <div class="image-sub">${item.sub}</div>
            </div>
        `;

        imageTrack.appendChild(card);
    });
}

createStoryCards();

const SHOPIFY_DOMAIN = "end47d-gg.myshopify.com";

const STOREFRONT_ACCESS_TOKEN =
  "a4aa6196e6d7a4a21938d6ce574aa4b5";

const SHOPIFY_API_URL =
  `https://${SHOPIFY_DOMAIN}/api/2026-04/graphql.json`;

let cartId = null;
let cartCheckoutUrl = null;
let cartCount = 0;

async function shopifyFetch(query, variables = {}) {
    const response = await fetch(SHOPIFY_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": STOREFRONT_ACCESS_TOKEN
        },
        body: JSON.stringify({
            query,
            variables
        })
    });

    return await response.json();
}

const PRODUCTS_QUERY = `
{
  products(first: 8, query: "tag:featured-drop AND tag:thug-coding") {
    edges {
      node {
        id
        title
        handle
        tags
        featuredImage {
          url
          altText
        }
        options {
          name
          values
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              selectedOptions {
                name
                value
              }
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
}
`;

const CREATE_CART_MUTATION = `
mutation cartCreate($lines: [CartLineInput!]) {
  cartCreate(input: { lines: $lines }) {
    cart {
      id
      checkoutUrl
      totalQuantity
    }
    userErrors {
      field
      message
    }
  }
}
`;

const ADD_TO_CART_MUTATION = `
mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
  cartLinesAdd(cartId: $cartId, lines: $lines) {
    cart {
      id
      checkoutUrl
      totalQuantity
    }
    userErrors {
      field
      message
    }
  }
}
`;

async function loadShopifyProducts() {
    const productGrid = document.getElementById("productGrid");

    productGrid.innerHTML = `<p style="color:#999;">Loading products...</p>`;

    try {
        const result = await shopifyFetch(PRODUCTS_QUERY);

        console.log("Shopify product result:", result);

        if (!result.data || !result.data.products) {
            productGrid.innerHTML = `<p style="color:#999;">Products could not load. Check console.</p>`;
            return;
        }

        const products = result.data.products.edges
            .map(edge => edge.node)
            .filter(product => {
                const tags = product.tags.map(tag => tag.toLowerCase());
                return tags.includes("featured-drop") && tags.includes("thug-coding");
            });

        if (!products.length) {
            productGrid.innerHTML = `
                <p style="color:#999;">
                    No featured products found. Make sure each homepage product has both tags:
                    <strong>featured-drop</strong> and <strong>thug-coding</strong>.
                </p>
            `;
            return;
        }

        productGrid.innerHTML = "";

        products.forEach(product => {
            const variants = product.variants.edges.map(edge => edge.node);
            const availableVariants = variants.filter(v => v.availableForSale);

            if (!availableVariants.length) return;

            let selectedVariant = availableVariants[0];

            const image = product.featuredImage?.url || "images/product-placeholder.jpg";
            const alt = product.featuredImage?.altText || product.title;
            const productUrl = `https://${SHOPIFY_DOMAIN}/products/${product.handle}`;

            const optionHTML = product.options.map(option => {
                if (option.name.toLowerCase() === "title" && option.values.length === 1) {
                    return "";
                }

                return `
                    <div class="variant-group">
                        <label class="variant-label">${option.name}</label>
                        <select class="variant-select" data-option-name="${option.name}">
                            ${option.values.map(value => `
                                <option value="${value}">${value}</option>
                            `).join("")}
                        </select>
                    </div>
                `;
            }).join("");

            const card = document.createElement("div");
            card.classList.add("product-card");

            card.innerHTML = `
                <a class="product-image" href="${productUrl}">
                    <img src="${image}" alt="${alt}">
                </a>

                <div class="product-info">
                    <div class="product-category">THUG CODING™ DROP</div>

                    <div class="product-name">
                        ${product.title}
                    </div>

                    <div class="variant-box">
                        ${optionHTML}
                    </div>

                    <div class="product-price">
                        $${Number(selectedVariant.price.amount).toFixed(2)}
                    </div>

                    <button class="product-btn" type="button">
                        ADD TO CART
                    </button>
                </div>
            `;

            const selects = card.querySelectorAll(".variant-select");
            const priceEl = card.querySelector(".product-price");
            const button = card.querySelector(".product-btn");

            function updateSelectedVariant() {
                if (!selects.length) {
                    selectedVariant = availableVariants[0];
                    priceEl.textContent = `$${Number(selectedVariant.price.amount).toFixed(2)}`;
                    button.disabled = false;
                    button.textContent = "ADD TO CART";
                    return;
                }

                const selectedOptions = Array.from(selects).map(select => ({
                    name: select.dataset.optionName,
                    value: select.value
                }));

                const match = variants.find(variant => {
                    return selectedOptions.every(option => {
                        return variant.selectedOptions.some(selected =>
                            selected.name === option.name &&
                            selected.value === option.value
                        );
                    });
                });

                if (!match || !match.availableForSale) {
                    button.disabled = true;
                    button.textContent = "SOLD OUT";
                    return;
                }

                selectedVariant = match;
                priceEl.textContent = `$${Number(selectedVariant.price.amount).toFixed(2)}`;
                button.disabled = false;
                button.textContent = "ADD TO CART";
            }

            selects.forEach(select => {
                select.addEventListener("change", updateSelectedVariant);
            });

            button.addEventListener("click", async () => {
                button.disabled = true;
                button.textContent = "ADDING...";

                await addToCart(selectedVariant.id);

                button.disabled = false;
                button.textContent = "ADD TO CART";
            });

            updateSelectedVariant();
            productGrid.appendChild(card);
        });

    } catch (error) {
        console.log("Product loading error:", error);
        productGrid.innerHTML = `<p style="color:#999;">Products could not load. Check console.</p>`;
    }
}

async function addToCart(variantId) {
    try {
        let result;

        if (!cartId) {
            result = await shopifyFetch(CREATE_CART_MUTATION, {
                lines: [
                    {
                        merchandiseId: variantId,
                        quantity: 1
                    }
                ]
            });

            console.log("Create cart result:", result);

            if (
                !result.data ||
                !result.data.cartCreate ||
                result.data.cartCreate.userErrors.length
            ) {
                console.log("Cart create errors:", result.data?.cartCreate?.userErrors);
                alert("Could not add item.");
                return;
            }

            cartId = result.data.cartCreate.cart.id;
            cartCheckoutUrl = result.data.cartCreate.cart.checkoutUrl;
            cartCount = result.data.cartCreate.cart.totalQuantity;

        } else {
            result = await shopifyFetch(ADD_TO_CART_MUTATION, {
                cartId: cartId,
                lines: [
                    {
                        merchandiseId: variantId,
                        quantity: 1
                    }
                ]
            });

            console.log("Add to cart result:", result);

            if (
                !result.data ||
                !result.data.cartLinesAdd ||
                result.data.cartLinesAdd.userErrors.length
            ) {
                console.log("Cart add errors:", result.data?.cartLinesAdd?.userErrors);
                alert("Could not add item.");
                return;
            }

            cartCheckoutUrl = result.data.cartLinesAdd.cart.checkoutUrl;
            cartCount = result.data.cartLinesAdd.cart.totalQuantity;
        }

        updateCartButton();

    } catch (error) {
        console.log("Add to cart error:", error);
        alert("Could not add item.");
    }
}

function updateCartButton() {
    const cartButton = document.getElementById("cartButton");
    cartButton.textContent = `Cart (${cartCount})`;
}

document.getElementById("cartButton").addEventListener("click", () => {
    if (!cartCheckoutUrl) {
        alert("Your cart is empty.");
        return;
    }

    window.location.href = cartCheckoutUrl;
});

loadShopifyProducts();

// ==========================================================
// THUG CODING® RADIO — REAL AUDIO REACTIVE WAVEFORMS
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {

    const radioButtons =
        document.querySelectorAll(".radio-play-btn");

    const radioPlayers =
        document.querySelectorAll(".radio-card audio");

    // ------------------------------------------------------
    // ONE AUDIO CONTEXT FOR THE RADIO SYSTEM
    // ------------------------------------------------------

    const AudioContextClass =
        window.AudioContext || window.webkitAudioContext;

    const audioContext =
        new AudioContextClass();

    const analyserSystems = new Map();

    let activeAnimationFrame = null;


    // ======================================================
    // BUILD ANALYSER FOR AN AUDIO ELEMENT
    // ======================================================

    function getAnalyserSystem(audio) {

        if (analyserSystems.has(audio)) {
            return analyserSystems.get(audio);
        }

        const source =
            audioContext.createMediaElementSource(audio);

        const analyser =
            audioContext.createAnalyser();

        analyser.fftSize = 256;

        analyser.smoothingTimeConstant = 0.78;

        source.connect(analyser);

        analyser.connect(audioContext.destination);

        const frequencyData =
            new Uint8Array(
                analyser.frequencyBinCount
            );

        const system = {
            source,
            analyser,
            frequencyData
        };

        analyserSystems.set(audio, system);

        return system;
    }


    // ======================================================
    // RESET A WAVEFORM
    // ======================================================

    function resetWaveform(card) {

        if (!card) return;

        const bars =
            card.querySelectorAll(
                ".radio-waveform span"
            );

        bars.forEach((bar, index) => {

            // Keep a little visual variation when stopped
            const idleHeight =
                index % 4 === 0 ? 0.8 :
                index % 3 === 0 ? 0.55 :
                0.35;

            bar.style.transform =
                `scaleY(${idleHeight})`;

            bar.style.opacity = ".65";

        });

    }


    // ======================================================
    // ACTUAL AUDIO VISUALIZATION
    // ======================================================

    function visualizeAudio(audio, card) {

        if (activeAnimationFrame) {
            cancelAnimationFrame(
                activeAnimationFrame
            );
        }

        const system =
            getAnalyserSystem(audio);

        const analyser =
            system.analyser;

        const data =
            system.frequencyData;

        const bars =
            card.querySelectorAll(
                ".radio-waveform span"
            );


        function draw() {

            if (audio.paused) {

                resetWaveform(card);

                return;
            }

            analyser.getByteFrequencyData(data);


            bars.forEach((bar, index) => {

                /*
                   Spread our visual bars across
                   useful portions of the frequency data.
                */

                const dataIndex =
                    Math.floor(
                        (index / bars.length) *
                        (data.length * 0.72)
                    );

                const value =
                    data[dataIndex];


                // Normalize 0–255
                const normalized =
                    value / 255;


                /*
                   Minimum keeps lines visible.
                   Maximum gives strong movement.
                */

                const scale =
                    0.25 +
                    normalized * 2.8;


                bar.style.transform =
                    `scaleY(${scale})`;


                bar.style.opacity =
                    0.45 +
                    normalized * 0.55;

            });


            activeAnimationFrame =
                requestAnimationFrame(draw);

        }


        draw();

    }


    // ======================================================
    // PLAY BUTTONS
    // ======================================================

    radioButtons.forEach(button => {

        button.addEventListener(
            "click",
            async () => {

                const audioId =
                    button.dataset.audio;

                const selectedAudio =
                    document.getElementById(
                        audioId
                    );

                if (!selectedAudio) return;


                const selectedCard =
                    button.closest(
                        ".radio-card"
                    );


                // ------------------------------------------
                // Browser requires AudioContext to resume
                // after a user interaction
                // ------------------------------------------

                if (
                    audioContext.state ===
                    "suspended"
                ) {

                    await audioContext.resume();

                }


                // ------------------------------------------
                // PAUSE ACTIVE STATION
                // ------------------------------------------

                if (!selectedAudio.paused) {

                    selectedAudio.pause();

                    button.textContent = "▶";

                    resetWaveform(
                        selectedCard
                    );

                    return;
                }


                // ------------------------------------------
                // STOP OTHER STATIONS
                // ------------------------------------------

                radioPlayers.forEach(
                    audio => {

                        if (
                            audio !==
                            selectedAudio
                        ) {

                            audio.pause();

                            const otherCard =
                                audio.closest(
                                    ".radio-card"
                                );

                            resetWaveform(
                                otherCard
                            );

                        }

                    }
                );


                radioButtons.forEach(
                    otherButton => {

                        otherButton.textContent =
                            "▶";

                    }
                );


                // ------------------------------------------
                // PLAY SELECTED STREAM
                // ------------------------------------------

                try {

                    await selectedAudio.play();

                    button.textContent =
                        "❚❚";


                    visualizeAudio(
                        selectedAudio,
                        selectedCard
                    );

                }

                catch (error) {

                    console.error(
                        "THUG CODING Radio playback error:",
                        error
                    );

                    resetWaveform(
                        selectedCard
                    );

                }

            }
        );

    });


    // ======================================================
    // AUDIO EVENTS
    // ======================================================

    radioPlayers.forEach(audio => {

        audio.addEventListener(
            "pause",
            () => {

                const card =
                    audio.closest(
                        ".radio-card"
                    );

                resetWaveform(card);


                const button =
                    document.querySelector(
                        `.radio-play-btn[data-audio="${audio.id}"]`
                    );

                if (button) {
                    button.textContent =
                        "▶";
                }

            }
        );


        audio.addEventListener(
            "playing",
            () => {

                const card =
                    audio.closest(
                        ".radio-card"
                    );

                visualizeAudio(
                    audio,
                    card
                );

            }
        );

    });


    // Initial resting state
    document
        .querySelectorAll(".radio-card")
        .forEach(resetWaveform);

});