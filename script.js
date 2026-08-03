"use strict";

/*==========================================
        DOM READY
==========================================*/

document.addEventListener("DOMContentLoaded", () => {

    initLoader();

    initHeader();

    initMenu();

    initSmoothScroll();

    initScrollTop();

});


/*==========================================
        PAGE LOADER
==========================================*/

function initLoader(){

    const loader=document.getElementById("loader");

    window.addEventListener("load",()=>{

        loader.style.opacity="0";

        loader.style.visibility="hidden";

        document.body.classList.add("loaded");

    });

}


/*==========================================
        STICKY HEADER
==========================================*/

function initHeader(){

    const header=document.getElementById("header");

    window.addEventListener("scroll",()=>{

        if(window.scrollY>80){

            header.style.background="rgba(8,12,16,.92)";

            header.style.backdropFilter="blur(25px)";

            header.style.boxShadow="0 15px 40px rgba(0,0,0,.35)";

        }

        else{

            header.style.background="rgba(13,18,24,.55)";

            header.style.boxShadow="none";

        }

    });

}


/*==========================================
        MOBILE MENU
==========================================*/

function initMenu(){

    const menuBtn=document.getElementById("menuBtn");

    const nav=document.getElementById("nav");

    menuBtn.addEventListener("click",()=>{

        nav.classList.toggle("active");

        menuBtn.classList.toggle("active");

    });

    document.querySelectorAll("#nav a")

    .forEach(link=>{

        link.addEventListener("click",()=>{

            nav.classList.remove("active");

            menuBtn.classList.remove("active");

        });

    });

}


/*==========================================
        SMOOTH SCROLL
==========================================*/

function initSmoothScroll(){

    document

    .querySelectorAll('a[href^="#"]')

    .forEach(anchor=>{

        anchor.addEventListener("click",function(e){

            e.preventDefault();

            const target=document.querySelector(

            this.getAttribute("href"));

            if(target){

                target.scrollIntoView({

                    behavior:"smooth"

                });

            }

        });

    });

}


/*==========================================
        SCROLL TOP
==========================================*/

function initScrollTop(){

    const btn=document.getElementById("scrollTop");

    window.addEventListener("scroll",()=>{

        if(window.scrollY>500){

            btn.classList.add("show");

        }

        else{

            btn.classList.remove("show");

        }

    });

    btn.addEventListener("click",()=>{

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    });

}

/*==========================================
        COUNTER ANIMATION
==========================================*/

function initCounter(){

    const counters=document.querySelectorAll(".counter");

    if(!counters.length) return;

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(!entry.isIntersecting) return;

            const counter=entry.target;

            const target=+counter.dataset.target;

            const speed=80;

            const update=()=>{

                const current=+counter.innerText;

                const increment=Math.ceil(target/speed);

                if(current<target){

                    counter.innerText=current+increment;

                    requestAnimationFrame(update);

                }else{

                    counter.innerText=target+"+";

                }

            };

            update();

            observer.unobserve(counter);

        });

    },{

        threshold:.5

    });

    counters.forEach(counter=>observer.observe(counter));

}

initCounter();


/*==========================================
        SCROLL REVEAL
==========================================*/

function initReveal(){

    const elements=document.querySelectorAll(

    "section,.project-card,.vision-card,.testimonial-card,.info-card,.counter-box,.contact-item");

    const observer=new IntersectionObserver(entries=>{

        entries.forEach(entry=>{

            if(entry.isIntersecting){

                entry.target.classList.add("show");

            }

        });

    },{

        threshold:.15

    });

    elements.forEach(el=>{

        el.classList.add("fade-up");

        observer.observe(el);

    });

}

initReveal();


/*==========================================
        CURSOR LIGHT
==========================================*/

function initCursor(){

    const light=document.querySelector(".cursor-light");

    if(!light) return;

    window.addEventListener("mousemove",(e)=>{

        light.style.left=e.clientX+"px";

        light.style.top=e.clientY+"px";

    });

}

initCursor();


/*==========================================
        HERO PARALLAX
==========================================*/

function initHeroParallax(){

    const photo=document.querySelector(".photo-wrapper");

    if(!photo) return;

    document.addEventListener("mousemove",(e)=>{

        const x=(window.innerWidth/2-e.clientX)/35;

        const y=(window.innerHeight/2-e.clientY)/35;

        photo.style.transform=

        `rotateY(${x}deg) rotateX(${-y}deg)`;

    });

    document.addEventListener("mouseleave",()=>{

        photo.style.transform=

        "rotateY(0deg) rotateX(0deg)";

    });

}

initHeroParallax();


/*==========================================
        FLOATING CARDS
==========================================*/

function initFloating(){

    const cards=document.querySelectorAll(

    ".experience-card,.project-card");

    cards.forEach((card,index)=>{

        card.style.animationDelay=

        `${index*.6}s`;

    });

}

initFloating();


/*==========================================
        ACTIVE NAVIGATION
==========================================*/

function initActiveMenu(){

    const sections=document.querySelectorAll("section");

    const links=document.querySelectorAll("#nav a");

    window.addEventListener("scroll",()=>{

        let current="";

        sections.forEach(section=>{

            const top=

            section.offsetTop-150;

            if(pageYOffset>=top){

                current=section.id;

            }

        });

        links.forEach(link=>{

            link.classList.remove("active");

            if(

            link.getAttribute("href")

            ==="#"+current){

                link.classList.add("active");

            }

        });

    });

}

initActiveMenu();