import { setDefaultHomepage } from "discourse/lib/utilities";
import { withPluginApi } from 'discourse/lib/plugin-api';
import { observes } from 'ember-addons/ember-computed-decorators';

export default {
  name: 'home-edits',
  initialize(container) {
    const currentUser = container.lookup('current-user:main');
    if (!currentUser || !currentUser.homepage_id) setDefaultHomepage('home');

    withPluginApi('0.8.23', api => {
      api.modifyClass('model:group', {
        @observes('client_group')
        setClientGroupDefaults() {
          if (this.get('client_group')) {
            this.setProperties({
              mentionable_level: 3,
              messageable_level: 3,
              visibility_level: 2,
              members_visibility_level: 2,
              title: "Client",
              grant_trust_level: 3
            });
          }
        },

        asJSON() {
          let attrs = this._super();
          attrs['client_group'] = this.get('client_group');
          return attrs;
        }
      });
      
      api.addNavigationBarItem({
        name: "work",
        displayName: "Work",
        href: "/work",
        customFilter: function (category, args) { 
          return currentUser && currentUser.staff && !category;
        }
      })
    });
  }
};
