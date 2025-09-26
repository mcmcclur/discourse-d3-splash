import Component from "@glimmer/component";
import { action } from "@ember/object";
import didInsert from "@ember/render-modifiers/modifiers/did-insert";
import loadScript from "discourse/lib/load-script";

export default class D3Splash extends Component {
  async ensureD3() {
    await loadScript(settings.theme_uploads.d3);
    await loadScript(settings.theme_uploads.tippy);
    return loadScript(settings.theme_uploads.user_bubble_chart)
  }

  @action 
  draw() {
    this.ensureD3().then(async function() {
      const data = await fetch(settings.theme_uploads.data)
          .then(r => r.json());
      const chart = user_bubble_chart(data, d3, tippy);
      d3.select(".d3-splash").append(() => chart)
    })
  }

  <template>
    <div class="d3-splash" {{didInsert this.draw}}></div>
  </template>
}
