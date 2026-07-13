const DISTANCE = 200;
const DURATION = 750;

const map = new WeakMap()

// 仅对视口外滚动触发的动画做路由去重（后退导航不重复）
const animatedRoutes = new Set<string>();
function routeKey(): string {
    return window.location.pathname;
}

const ob = new IntersectionObserver((entries) => {
    for (const entry of entries){
        if(entry.isIntersecting){
            const animation = map.get(entry.target);
            if (animation){
                animation.play()
                ob.unobserve(entry.target)
                animatedRoutes.add(routeKey())
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
        } else if (!animatedRoutes.has(routeKey())) {
            // 视口外：滚动触发（首次，后退不重复）
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
