class SoundCloud extends Sup.Behavior {
    
    private static client_id : string = '29c3bd07f77f1de4398d905f91da4439'; // to get an ID go to http://developers.soundcloud.com/
    private static SC;
    
    start() {
        window.SC.initialize({client_id: SoundCloud.client_id});
        SoundCloud.SC = window.SC;        
        SoundCloud.SC.get('/resolve', {url: "https://soundcloud.com/s3rl/s3rl-pika-girl-radio-edit-emfa"}, function(url){
            if( !url.errors ){
                Sup.log(url);
                if( url.kind == "playlist" ){
                    
                }else{
                    SoundCloud.SC.stream('/tracks/'+url.id, function(sound){
                        //sound.start();
                    });
                }
            }
        });
    }

    update() {
        
    }
}
Sup.registerBehavior(SoundCloud);