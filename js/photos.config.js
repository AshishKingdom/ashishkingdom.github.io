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
        title: 'Clicks',      // the giant word, set in difference blend over the collage
        by: 'by Ashish',      // the line under it, same blend
        subtitle: 'Trails walked, summits reached, and the long roads between them.',
        kicker: 'Photographs & films · Ashish Kushwaha',
        reveal: 'Places I walked to, and the light I found there.',
        // collage: the frames for the drifting wall behind the title, using the same fields
        // as media items ({ src, ratio, type, poster }). Leave it empty to use every frame below.
        collage: []
    },

    statement: {
        label: 'A note before the photographs',
        // words in [brackets] take the colours of the places, in order
        text: 'I carry a camera up [mountains], along [trails] and out to the [sea] — to prove, later, that those places were real.'
    },

    places: [
        {
            id: 'triund', name: 'Triund', region: 'Dharamshala, Himachal Pradesh', accent: '#e0632f', layout: 'iris',
            story: '[A line or two about this trek — who you went with, the weather, the moment that made it.]',
            facts: { Altitude: '2,850 m', When: '[Month Year]', Trail: '[00] km' },
            media: [
                { title: '[Sunrise over the Dhauladhars]', place: 'Triund', date: '[Year]', scene: 'peak', mood: 'dawn' },
                { title: '[Caption]', place: 'Triund', date: '[Year]', ratio: '4/5', scene: 'peak', mood: 'day' },
                { type: 'video', title: '[Clip caption]', place: 'Triund', date: '[Year]', ratio: '9/16', scene: 'trail', mood: 'mint' },
                { title: '[Caption]', place: 'Triund', date: '[Year]', ratio: '3/2', scene: 'peak', mood: 'golden' },
                { title: '[Caption]', place: 'Triund', date: '[Year]', ratio: '4/5', scene: 'peak', mood: 'haze' }
            ]
        },
        {
            id: 'place-2', name: '[Location]', region: '[Region, Country]', accent: '#23866f', layout: 'gallery',
            story: '[A line or two about this place.]',
            facts: { Altitude: '[0000] m', When: '[Month Year]' },
            media: [
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '3/2', scene: 'trail', mood: 'mint' },
                { type: 'video', title: '[Clip caption]', place: '[Location]', date: '[Year]', ratio: '9/16', scene: 'trail', mood: 'golden' },
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '4/5', scene: 'peak', mood: 'haze' },
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '3/2', scene: 'trail', mood: 'dawn' },
                { type: 'video', title: '[Clip caption]', place: '[Location]', date: '[Year]', ratio: '9/16', scene: 'peak', mood: 'day' },
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '3/2', scene: 'trail', mood: 'day' },
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '3/4', scene: 'peak', mood: 'golden' }
            ]
        },
        {
            id: 'place-3', name: '[Location]', region: '[Region, Country]', accent: '#7656c9', layout: 'collage',
            story: '[A line or two about this place.]',
            facts: { When: '[Month Year]' },
            media: [
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '3/2', scene: 'dune', mood: 'sand' },
                { type: 'video', title: '[Clip caption]', place: '[Location]', date: '[Year]', ratio: '9/16', scene: 'dune', mood: 'golden' },
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '16/9', scene: 'dune', mood: 'dawn' }
            ]
        },
        {
            id: 'place-4', name: '[Location]', region: '[Region, Country]', accent: '#1d86b5', layout: 'cinema',
            story: '[A line or two about this place.]',
            facts: { When: '[Month Year]' },
            media: [
                { type: 'video', title: '[Clip caption]', place: '[Location]', date: '[Year]', ratio: '16/9', scene: 'coast', mood: 'sunset' },
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '4/5', scene: 'coast', mood: 'tropic' },
                { title: '[Caption]', place: '[Location]', date: '[Year]', ratio: '3/2', scene: 'coast', mood: 'day' }
            ]
        }
    ],

    contactSheet: {
        title: 'Every frame',
        blurb: 'The whole roll in one strip. Hover to hold it still, tap a frame to open it.'
    }
};
