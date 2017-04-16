var router = require('express').Router();

router.get('/', (req, res) => {
    req.db.collection('video').find((err, data) =>  {
        res.render('index.ejs');
    });
});

router.get('/random-video', (req, res) => {
    var isAjax = req.xhr;


        req.db.collection('videos').aggregate(    [ { $sample: { size: 1 } } ], function(err, video) {
                var keys = Object.keys(video[0]);
                var vid = { iframe: video[0][keys[1]] }
                if(isAjax) {
                    res.json(vid);
                } else {
                    res.render('random.ejs', vid);
                }
        });

});

module.exports = router;
