import { App } from 'vue';
import loading from './loading';
const directivesList: any = {
  loading
};

const directives = {
  install: function (app: App<Element>) {
    Object.keys(directivesList).forEach(key => {
      //注册所有指令
      app.directive(key, directivesList[key]);
    });
  }
};
export default directives
