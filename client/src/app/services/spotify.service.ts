import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    return this.http.get(this.expressBaseUrl+endpoint)
    .toPromise().then((response)=> {
      return response;
    }).catch ((reject) => {
      console.log(reject.message);
    });
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data 
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]> {
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.
   
    var tempArray=[];
    var encodedResource=encodeURIComponent(resource);
    return this.sendRequestToExpress('/search/'+category+'/'+encodedResource).then((response)=> {
      if (category=='artist'){
        response.artists.items.forEach((data) => {
          tempArray.push(new ArtistData(data));
        });
      }
      else if (category=='track') {
        response.tracks.items.forEach((data) => {
          tempArray.push(new TrackData(data));
        });

      }
      else if (category=='album') {
        response.albums.items.forEach((data) => {
          tempArray.push(new AlbumData(data));
        });
      }
      return tempArray;
    });
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return this.sendRequestToExpress('/artist/' + encodeURIComponent(artistId)).then((response) => {
      return new ArtistData(response);
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    var tempArray=[]
    return this.sendRequestToExpress('/artist-related-artists/' + encodeURIComponent(artistId)).then((response) => {
      response.artists.forEach((data)=> {
        tempArray.push(new ArtistData(data));
      });
      return tempArray;
    });
  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    var tempArray=[]
    return this.sendRequestToExpress('/artist-top-tracks/'+encodeURIComponent(artistId)).then((response)=> {
      response.tracks.forEach((data)=> {
        tempArray.push(new TrackData(data));
      });
      return tempArray;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    var tempArray=[]
    return this.sendRequestToExpress('/artist-albums/'+encodeURIComponent(artistId)).then((response)=> {
      response.items.forEach((data)=> {
        tempArray.push(new AlbumData(data));
      });
      return tempArray;
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return this.sendRequestToExpress('/album/'+encodeURIComponent(albumId)).then((response)=> {
      return new AlbumData(response);
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    var tempArray=[]
    return this.sendRequestToExpress('/album-tracks/'+encodeURIComponent(albumId)).then((response)=> {
      response.items.forEach((data)=> {
        tempArray.push(new TrackData(data));
      });
      return tempArray;
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return this.sendRequestToExpress('/track/'+encodeURIComponent(trackId)).then((response)=> {
      return new TrackData(response);
    });
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    return this.sendRequestToExpress('/track-audio-features/'+encodeURIComponent(trackId)).then((response)=> {
      var tempArray=[]
      Object.keys(response).forEach((key)=> {
        if (TrackFeature.FeatureTypes.includes(key)) {
          tempArray.push(new TrackFeature(key,response[key]));
        }
      });
      return tempArray;
    });
  }
}
