import AppModel from '../models/AppModel';
import AppView from '../views/AppView';


export default class App {
  constructor() {
    this.state = {
      url: 'https://www.googleapis.com/youtube/v3/search?key=AIzaSyCNBZn-uMH2qjYYSAood2XlZMt1rkSqHcA&type=video&part=snippet&maxResults=15&q=js',
    };
  }

  async start() {
    const model = new AppModel(this.state);
    const data = await model.getClipData();
    const view = new AppView(data);

    view.render();
  }
}
