/* ========================================
   ARCHIVE DATA
   Cards for the 3D Archive gallery (Archive.exe).

   To add a card: drop the PNG in assets/projects/zeynep-archive/full/,
   the 600px preview in .../thumbs/, then append one row below.
   Nothing else needs touching -- the gallery sizes, lays out and
   choreographs itself from however many rows are in this array.

   image   full-resolution PNG, used untouched in the detail view
   preview lighter copy used on the rail (same artwork, smaller file)
   ======================================== */

const ARCHIVE_DIR = 'assets/projects/zeynep-archive/';

/* Which copy of the artwork each view loads. The art itself is never
   altered -- these are delivery copies at different resolutions.

   thumbs/  600px  JPEG   2.3 MB total   the rail
   web/    1400px  JPEG    10 MB total   the detail view
   full/          PNG      42 MB total   the untouched originals

   Set either of these to 'image' to serve the originals instead.          */
const ARCHIVE_RAIL_SOURCE   = 'preview';
const ARCHIVE_DETAIL_SOURCE = 'web';

const ARCHIVE_CARDS = [
    { id: 'FILE_001', title: 'ZEYNEP.EXE',    file: '001' },
    { id: 'FILE_002', title: 'CAMERA & FILM', file: '002' },
    { id: 'FILE_003', title: 'JAPAN DIARIES', file: '003' },
    { id: 'FILE_004', title: 'TRAVEL FILE',   file: '004' },
    { id: 'FILE_005', title: 'ROWING LOG',    file: '005' },
    { id: 'FILE_006', title: 'QUEST NOTES',   file: '006' },
    { id: 'FILE_007', title: 'SOUNDTRACKS',   file: '007' },
    { id: 'FILE_008', title: 'HOME CORNERS',  file: '008' },
    { id: 'FILE_009', title: 'GOOD FOOD',     file: '009' },
    { id: 'FILE_010', title: 'SECRET STUFF',  file: '010' },
    { id: 'FILE_011', title: 'COFFEE BREAK',  file: '011' },
    { id: 'FILE_012', title: 'BOOK NOOK',     file: '012' },
    { id: 'FILE_013', title: 'CINEMA NIGHTS', file: '013' },
    { id: 'FILE_014', title: 'STICKER BOX',   file: '014' },
    { id: 'FILE_015', title: 'SUMMER NOTES',  file: '015' },
    { id: 'FILE_016', title: 'DANCE FILE',    file: '016' },
    { id: 'FILE_017', title: 'CITY LIGHTS',   file: '017' },
    { id: 'FILE_018', title: 'SWEET THINGS',  file: '018' },
    { id: 'FILE_019', title: 'SKETCHBOOK',    file: '019' },
    { id: 'FILE_020', title: 'CAT MOMENTS',   file: '020' }
].map(function (c) {
    return {
        id: c.id,
        title: c.title,
        image:   ARCHIVE_DIR + 'full/file-'   + c.file + '.png',
        web:     ARCHIVE_DIR + 'web/file-'    + c.file + '.jpg',
        preview: ARCHIVE_DIR + 'thumbs/file-' + c.file + '.jpg'
    };
});

window.ARCHIVE_DIR = ARCHIVE_DIR;
window.ARCHIVE_DETAIL_SOURCE = ARCHIVE_DETAIL_SOURCE;
window.ARCHIVE_CARDS = ARCHIVE_CARDS;
window.ARCHIVE_RAIL_SOURCE = ARCHIVE_RAIL_SOURCE;
