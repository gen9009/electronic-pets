import type { DirectiveBinding } from "vue";
import { createApp, Directive } from "vue";
import Loading from '../components/loading.vue'
import gsap from 'gsap'
const appendElementSibling = (el: HTMLElement, bind: DirectiveBinding) => {
  /* 
    'beforebegin': 在el的前面.
    'afterbegin':只在el当中, 在el第一个子孩子前面.
    'beforeend':只在el当中, 在el最后一个子孩子后面.
    'afterend': 在el的后面.
    */
  const loading = createApp(Loading).mount(document.createElement('div')).$el;
  bind.value && el.insertAdjacentElement('afterbegin', loading);
};
const loading: Directive = {
  mounted(el, binding: DirectiveBinding) {
    appendElementSibling(el, binding);
  },
  updated(el, binding: DirectiveBinding) {
    if (binding.oldValue !== binding.value) {
      //需要更新
      const loading = el.children[0];
      gsap.to(loading, {
        opacity: 1,
        scale: 0,
        duration: 1,
        onComplete: function () {
          loading.remove();
          appendElementSibling(el, binding);

        },
        ease: "power4.out", // 使用缓动函数控制过渡效果
      });
    }

  },
  unmounted(el) {
    const loading = el.nextElementSibling;
    loading && loading.remove();
  }
}
export default loading
