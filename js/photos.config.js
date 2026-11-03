// ============================================
// PHOTOS PAGE CONFIG
// ============================================
// The whole photos page (photos.html) is built from this one object.
// Add places, reorder them, add photos or videos: chapter numbers, the
// places index, colour transitions, counts and the viewer all follow.
//
// Put the files under images/photos/ (for example images/photos/triund/01.webp)
// and point `src` at them. Until a `src` is set, a drawn stand-in shows.
//
// place (chapter) fields:
//   id       anchor for links, e.g. 'triund' → photos.html#triund
//   name     big title             region   small line beside the number
//   story    a sentence or two     facts    { Label: 'value', ... } any you like
//   accent   the place's colour; the section tint is derived from it
//   layout   'iris'    first item opens out to full screen, the rest unfold below
//            'gallery' pinned 3D wall that slides sideways as you scroll
//            'collage' overlapping frames drifting at different speeds
//            'cinema'  first item as a wide curtain reveal, the rest below
//            'grid'    a simple unfolding grid
//
// media fields (photo or video):
//   type     'photo' (default) or 'video'
//   src      file URL. Leave it out and a drawn stand-in shows.
//   poster   still image for a video while it loads (also used in the strips)
//   ratio    '3/2', '4/5', '16/9', '9/16', '1/1' ...
//   title, place, date   the caption       alt   for screen readers
//   scene / mood         only shape the stand-in until src is set:
//            scene 'peak' | 'trail' | 'dune' | 'coast'
//            mood  'dawn' | 'day' | 'haze' | 'golden' | 'mint' | 'sand' | 'tropic' | 'sunset'
//
// The footer is the site's shared components/footer.html.

window.PHOTOS_CONFIG = {
    hero: {
        title: 'Clicks',      // solid foreground title above the collage
        by: 'by Ashish',      // the lighter line beneath the title
        subtitle: 'मंज़िल से पहले का सफ़र ही असली पड़ाव है',
        kicker: '',
        reveal: 'सफ़र वो नहीं जो मंज़िल तक ले जाए, सफ़र वो है जो तुम्हें बदल दे',
        // collage: the frames for the drifting wall behind the title, using the same fields
        // as media items ({ src, ratio, type, poster }). Leave it empty to use every frame below.
        collage: [
            { src: 'images/photos/valley-of-flowers/wildflower-meadow-between-mountains.jpg', ratio: '4/5' },
            { src: 'images/photos/triund/rocky-meadow-and-snowy-range.jpg', ratio: '4/5' },
            { src: 'images/photos/nag-tibba/hiker-on-golden-forest-slope.jpg', ratio: '4/5' },
            { src: 'images/photos/valley-of-flowers/clouds-drifting-over-green-valley.jpg', ratio: '4/5' },
            { src: 'images/photos/nag-tibba/hiker-facing-cloud-filled-valley.jpg', ratio: '4/5' },
            { src: 'images/photos/triund/snowy-mountains-under-grey-clouds.jpg', ratio: '4/5' },
            { src: 'images/photos/rishikesh/winding-river-through-mountain-valley.jpg', ratio: '4/5' },
            { src: 'images/photos/nag-tibba/setting-sun-above-treeline.jpg', ratio: '4/5' },
            { src: 'images/photos/valley-of-flowers/snowy-peak-rising-through-clouds.jpg', ratio: '4/5' },
            { src: 'images/photos/valley-of-flowers/rocky-stream-in-misty-green-valley.jpg', ratio: '4/5' }
        ]
    },

    statement: {
        label: 'A note before the photographs',
        // words in [brackets] take the colours of the places, in order
        text: 'थोड़ी सा [पागलपन] भी [ज़रूरी] है, वरना [पहाड़] कौन [चढ़ेगा]?'
    },

    places: [
    {
        "id": "triund",
        "name": "Triund",
        "region": "Himachal Pradesh",
        "accent": "#2fe0ab",
        "layout": "iris",
        "story": "",
        "facts": {},
        "media": [
            {
                "src": "images/photos/triund/orange-flags-before-snowy-peaks.jpg",
                "title": "Hanuman Ji behind Dhauladhar Ranges",
                "alt": "Hanuman Ji behind Dhauladhar Ranges"
            },
            {
                "src": "images/photos/triund/painted-stones-and-om-symbol.jpg",
                "title": "Painted stones near Shiva Café",
                "alt": "Painted stones near Shiva Café"
            },
            {
                "src": "images/photos/triund/bowl-of-noodles-at-foggy-camp.jpg",
                "title": "पहाड़ों वाली Maggi",
                "alt": "Maggi noodles at foggy camp"
            },
            {
                "src": "images/photos/triund/rocky-meadow-and-snowy-range.jpg",
                "title": "Dhauladhar Ranges View from Base Camp",
                "alt": "Dhauladhar Ranges View from Base Camp"
            },
            {
                "src": "images/photos/triund/snowy-mountains-under-grey-clouds.jpg",
                "title": "Cloudy Morning view at Triund Peak",
                "alt": "Cloudy Morning view at Triund Peak"
            },
            {
                "src": "images/photos/triund/dog-beside-hillside-camp.jpg",
                "title": "Our Trek Leader",
                "alt": "Our Trek Leader"
            },
            {
                "src": "images/photos/triund/buddha-statue-in-temple.jpg",
                "title": "Inside Tsuglagkhang Complex",
                "alt": "Inside Tsuglagkhang Complex"
            },
            {
                "src": "images/photos/triund/hand-holding-red-and-yellow-flower.jpg",
                "title": "A Flower in Tea Garden around McLeodGanj",
                "alt": "A Flower in Tea Garden around McLeodGanj"
            },
            {
                "src": "images/photos/triund/painted-trail-marker-and-stone-cairn.jpg",
                "title": "Some more lines to follow on the trail",
                "alt": "Some more lines to follow on the trail"
            },
            {
                "src": "images/photos/triund/portrait-among-tea-bushes.jpg",
                "title": "Me trying my best aesthetic pose",
                "alt": "Me trying my best aesthetic pose"
            },
        ]
    },
    {
        "id": "nag-tibba",
        "name": "Nag Tibba",
        "region": "Uttarakhand",
        "accent": "#ee9f1f",
        "layout": "gallery",
        "story": "",
        "facts": {},
        "media": [
            {
                "src": "images/photos/nag-tibba/hand-holding-yellow-daisies.jpg",
                "title": "Collection on trails",
                "alt": "Collection on trails"
            },
            {
                "src": "images/photos/nag-tibba/backpacker-overlooking-green-ridges.jpg",
                "title": "Still 8 hours to go",
                "alt": "Still 8 hours to go"
            },
            {
                "src": "images/photos/nag-tibba/stone-cairn-above-valley.jpg",
                "title": "How many stones can you stack?",
                "alt": "How many stones can you stack?"
            },
            {
                "src": "images/photos/nag-tibba/sunbeams-over-layered-mountains.jpg",
                "title": "Sunbeams over layered mountains",
                "alt": "Sunbeams over layered mountains"
            },
            {
                "src": "images/photos/nag-tibba/white-daisies-along-hillside-trail.jpg",
                "title": "Another wild flower bushes along the trail",
                "alt": "Another wild flower bushes along the trail"
            },
            {
                "src": "images/photos/nag-tibba/setting-sun-above-treeline.jpg",
                "title": "One of my best sunsets in the mountains",
                "alt": "One of my best sunsets in the mountains"
            },
            {
                "src": "images/photos/nag-tibba/cloud-sea-framed-by-trees.jpg",
                "title": "Early morning view with Pink clouds",
                "alt": "Early morning view with Pink clouds"
            },
            {
                "src": "images/photos/nag-tibba/sunlit-slope-above-cloud-sea.jpg",
                "title": "Nag Tibba summit view above the clouds",
                "alt": "Nag Tibba summit view above the clouds"
            },
            {
                "src": "images/photos/nag-tibba/distant-peaks-above-clouds.jpg",
                "title": "Gangotri peaks visible from Nag Tibba summit",
                "alt": "Gangotri peaks visible from Nag Tibba summit"
            },
            {
                "src": "images/photos/nag-tibba/red-blossoms-in-forest.jpg",
                "title": "The Himalayan Rhododendron (बुरांश)",
                "alt": "The Himalayan Rhododendron (बुरांश)"
            },
            {
                "src": "images/photos/nag-tibba/fallen-leaves-on-forest-floor.jpg",
                "title": "Fallen leaves on forest trail",
                "alt": "Fallen leaves on forest trail"
            },
            {
                "src": "images/photos/nag-tibba/yellow-tent-on-grassy-campsite.jpg",
                "title": "The Base Camp at Nag Tibba",
                "alt": "The Base Camp at Nag Tibba"
            },
            {
                "src": "images/photos/nag-tibba/mossy-tree-in-woodland.jpg",
                "title": "Reminds me Dark Series from Netflix",
                "alt": "Reminds me Dark Series from Netflix"
            },
        ]
    },
    {
        "id": "rishikesh",
        "name": "Rishikesh",
        "region": "Uttarakhand",
        "accent": "#1d86b5",
        "layout": "cinema",
        "story": "",
        "facts": {},
        "media": [
            {
                "src": "images/photos/rishikesh/green-river-and-sandy-bank.jpg",
                "title": "Can you believe this is Ganga?",
                "alt": "Can you believe this is Ganga?"
            },
            {
                "src": "images/photos/rishikesh/warmly-lit-cafe-interior.jpg",
                "title": "Little Budha Cafe",
                "alt": "Little Budha Cafe"
            },
            {
                "src": "images/photos/rishikesh/twilight-between-mountain-silhouettes.jpg",
                "title": "Sunrise at Shivpuri, Rishikesh",
                "alt": "Sunrise at Shivpuri, Rishikesh"
            },
            {
                "src": "images/photos/rishikesh/hazy-view-through-hill-gap.jpg",
                "title": "On our way to Neer Waterfall",
                "alt": "On our way to Neer Waterfall"
            },
            {
                "src": "images/photos/rishikesh/winding-river-through-mountain-valley.jpg",
                "title": "A morning view of Ganga from the hills",
                "alt": "A morning view of Ganga from the hills"
            },
            {
                "src": "images/photos/rishikesh/forest-trail-beneath-bare-branches.jpg",
                "title": "A micro trek to reach Neer Waterfall",
                "alt": "A micro trek to reach Neer Waterfall"
            }
        ]
    },
    {
        "id": "valley-of-flowers",
        "name": "Valley of Flowers",
        "region": "Uttarakhand",
        "accent": "#f816cb",
        "layout": "collage",
        "story": "",
        "facts": {},
        "media": [
            {
                "src": "images/photos/valley-of-flowers/winding-paved-mountain-path.jpg",
                "title": "Homestay View in Joshimath",
                "alt": "Homestay View in Joshimath"
            },
            {
                "src": "images/photos/valley-of-flowers/mist-over-green-hillside-village.jpg",
                "title": "Mist over Karchi Village",
                "alt": "Mist over Karchi Village"
            },
            {
                "src": "images/photos/valley-of-flowers/faint-rainbow-over-cloudy-valley.jpg",
                "title": "Faint Rainbow in Karchi Village",
                "alt": "Faint Rainbow in Karchi Village"
            },
            {
                "src": "images/photos/valley-of-flowers/snowy-peak-rising-through-clouds.jpg",
                "title": "Mount Dronagiri visible from Karchi Village",
                "alt": "Mount Dronagiri visible from Karchi Village"
            },
            {
                "src": "images/photos/valley-of-flowers/jagged-ridges-beneath-evening-sky.jpg",
                "title": "Morning view at Ghangaria",
                "alt": "Morning view at Ghangaria"
            },
            {
                "src": "images/photos/valley-of-flowers/rocky-stream-in-misty-green-valley.jpg",
                "title": "On my way to Valley of Flowers",
                "alt": "On my way to Valley of Flowers"
            },
            {
                "src": "images/photos/valley-of-flowers/wildflower-meadow-between-mountains.jpg",
                "title": "Valley of Flowers / फूलों की घाटी",
                "alt": "Valley of Flowers / फूलों की घाटी"
            },
            {
                "src": "images/photos/valley-of-flowers/pink-flower-spike-in-greenery.jpg",
                "title": "Himalayan Whorlflower (Morina longifolia)",
                "alt": "Himalayan Whorlflower (Morina longifolia)"
            },
            {
                "src": "images/photos/valley-of-flowers/small-yellow-wildflowers.jpg",
                "title": "Rough Yellow Balsam (Impatiens scabrida)",
                "alt": "Rough Yellow Balsam (Impatiens scabrida)"
            },
            {
                "src": "images/photos/valley-of-flowers/pink-flower-beside-stony-soil.jpg",
                "title": "Himalayan balsam (Impatiens sulcata)",
                "alt": "Himalayan balsam (Impatiens sulcata)"
            },
            {
                "src": "images/photos/valley-of-flowers/orange-leaves-in-green-canopy.jpg",
                "title": "Himalayan maple (Acer acuminatum)",
                "alt": "Himalayan maple (Acer acuminatum)"
            },
            {
                "src": "images/photos/valley-of-flowers/rocky-peaks-and-overhead-wire.jpg",
                "title": "Morning view on the way to Hemkund Sahib",
                "alt": "Morning view on the way to Hemkund Sahib"
            },
            {
                "src": "images/photos/valley-of-flowers/stone-shrine-under-yellow-tarpaulin.jpg",
                "title": "Pink-browed Rosefinch (Carpodacus rodochroa)",
                "alt": "Pink-browed Rosefinch (Carpodacus rodochroa)"
            },
            {
                "src": "images/photos/valley-of-flowers/pink-flowers-on-mossy-bank.jpg",
                "title": "Slender Lousewort (Pedicularis gracilis)",
                "alt": "Slender Lousewort (Pedicularis gracilis)"
            },
            {
                "src": "images/photos/valley-of-flowers/blue-flowers-on-tall-stem.jpg",
                "title": "Himalayan Blue Poppy (Meconopsis aculeata)",
                "alt": "Himalayan Blue Poppy (Meconopsis aculeata)"
            }
        ]
    }
],

    contactSheet: {
        title: 'Frames',
        blurb: 'Tap a frame to open it.'
    }
};
