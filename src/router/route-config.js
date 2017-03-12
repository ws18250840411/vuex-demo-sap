import App from '../App.vue';
import Index from '../views/index'; 
import Page1 from '../views/page1';
import Page2 from '../views/page2';

export default {
	path: '/', component: App,
         children: [
	          { path: 'index', name:'index', component: Index },
	          { path: 'page1', name:'page1', component: Page1 },
	          { path: 'page2/:id', name:'page2', component: Page2 }
	]
}