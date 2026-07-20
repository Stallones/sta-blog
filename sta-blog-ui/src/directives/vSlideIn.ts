const DISTANCE = 200;
const DURATION = 750;

const map = new WeakMap()

// 元素级去重：已播放过动画的元素不再重复（替代路由级去重，避免父组件抢占子组件动画）
const animatedElements = new WeakSet<Element>();

const ob = new IntersectionObserver((entries) => {
    for (const entry of entries){
        if(entry.isIntersecting){
            const animation = map.get(entry.target);
            if (animation){
                animation.play()
                ob.unobserve(entry.target)
                animatedElements.add(entry.target)
            }
        }
    }
})

function createAnimation(el: HTMLElement) {
    return el.animate([
        { transform: `translateY(${DISTANCE}px)`, opacity: 0 },
        { transform: `translateY(0)`, opacity: 1 }
    ], {
        duration: DURATION,
        easing: 'ease-in-out',
        fill: 'forwards',
    })
}

// 元素是否在视口之下（距视口底部 > DISTANCE）
function isBelowViewport(el: HTMLElement){
    const rect = el.getBoundingClientRect()
    return rect.top - DISTANCE > window.innerHeight
}

export default {
    mounted(el: HTMLElement){
        if (!isBelowViewport(el)) {
            // 入场动画：预设隐藏态防闪 → 延迟播动画 → 结束清 inline
            el.style.opacity = '0';
            el.style.transform = `translateY(${DISTANCE}px)`;
            setTimeout(() => {
                const animation = createAnimation(el);
                animation.onfinish = () => {
                    el.style.opacity = '';
                    el.style.transform = '';
                };
            }, 150);
        } else if (!animatedElements.has(el)) {
            // 视口外：滚动触发（每个元素仅一次）
            animatedElements.add(el)
            const animation = createAnimation(el);
            animation.pause();
            ob.observe(el);
            map.set(el, animation);
        }
    },
    unmounted(el: HTMLElement){
        ob.unobserve(el)
    }
}
