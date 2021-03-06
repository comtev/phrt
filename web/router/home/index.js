var router = require('express').Router();
var ObjectId = require('mongodb').ObjectId;

router.get('/', (req, res) => {
    req.db.collection('video').find((err, data) =>  {
        res.render('index.ejs');
    });
});

router.get('/random-video', (req, res) => {
    var isAjax = req.xhr;

    req.db.collection('datacontent').aggregate([ { $sample: { size: 1 } } ]).nextObject(function(err, video) {
        var vid = { iframe: 'Oops error while getting video', id:undefined };
        if('IFRAME' in video) {
            vid.iframe = video.IFRAME;
            vid.id = video._id;
        }

        if(isAjax) {
            res.json(vid);
        } else {
            res.render('random.ejs', vid);
        }

    });

});

router.get('/watch/:id', (req, res) => {
    var regObjId = /^[0-9a-fA-F]{24}$/;
    var id = req.params.id;

    if(regObjId.test(id)) {
        req.db.collection('datacontent').findOne({_id: ObjectId(id)}, function(err, video) {
            if(err) {
                console.log(err);
            }

            res.render('random.ejs', {iframe: video.IFRAME, id: video._id});
        })
    } else {
        res.render('404.ejs');
    }
})

module.exports = router;
