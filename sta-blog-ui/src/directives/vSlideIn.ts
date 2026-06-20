const DISTANCE = 100;
const DURATION = 500;

const map = new WeakMap()

// 记录哪些路由已播过动画，同一路由再次挂载时跳过
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

// 是否在视口之下
function isBelowViewport(el: HTMLElement){
    const rect = el.getBoundingClientRect()
    return rect.top - DISTANCE > window.innerHeight
}

export default {
    mounted(el: HTMLElement){
        // 同一路由重新挂载（后退导航），跳过动画
        if (animatedRoutes.has(routeKey())) return;
        if(!isBelowViewport(el)){
            return;
        }
        const animation = el.animate([
            {
                transform: `translateY(${DISTANCE}px)`,
                opacity: 0
            },
            {
                transform: `translateY(0)`,
                opacity: 1
            }
        ],{
            duration: DURATION,
            easing: 'ease-in-out',
            fill: 'forwards',
        })
        animation.pause()
        ob.observe(el)
        map.set(el, animation)
    },
    unmounted(el: HTMLElement){
        ob.unobserve(el)
    }
}