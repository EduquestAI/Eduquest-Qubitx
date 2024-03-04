<script>
    import { Button } from '@/components/ui/button'
</script>
<template>
    <div class="flex flex-col px-10">
        <header class="flex fixed justify-between py-5 px-28 w-[95%] backdrop-blur-lg">
            <NuxtLink to="/"><img width="100px" src="@/assets/images/logo.png" alt="Eduquest"></NuxtLink>
            <div class="flex gap-5">
                <Button class=" p-2 rounded font-notosans font-bold text-slate-100 bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                    <NuxtLink to="/future">Future Plans</NuxtLink>
                </Button>
                <Button class="p-2 rounded font-notosans font-bold text-slate-100 bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                    <a href="https://github.com/EduquestAI/Eduquest-Qubitx" target="_blank">Learn More</a>
                </Button>
            </div>
        </header>
        <div class=" w-screen h-screen flex items-center justify-between p-28">
            <div class="flex flex-col gap-10">
                <p class=" text-5xl text-slate-900 font-bold font-varela">Empower Your Learning Journey</p>
                <p class=" text-xl mb-7 text-slate-700 font-notosans">Enjoy a world where education is guided by YOUR passions and preferences.</p>
                <div class="flex gap-3">
                    <Button class=" p-2 rounded font-notosans font-bold text-slate-100 bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                        <NuxtLink to="/quest">Get Started</NuxtLink>
                    </Button>
                    <Button class="p-2 rounded font-notosans font-bold text-slate-100 bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                        <a href="https://github.com/EduquestAI/Eduquest-Qubitx" target="_blank">Learn More</a>
                    </Button>
                </div>
            </div>
            <img width="400px" src="@/assets/images/mascot.png" alt="Eduquest Mascot">
        </div>
        <div class=" w-screen h-screen flex flex-col gap-8 justify-center p-28">
            <p class=" text-7xl text-slate-900 font-bold font-varela">Have TRUE Fun practicing K-5...</p>
            <ul class="text-3xl text-slate-900 font- font-varela">
                <li>- Math</li>
                <li>- Reading</li>
                <li>- English Comprehension</li>
                <li>- Science</li>
                <li>- History Memorization Strategies</li>
            </ul>
        </div>
        <div class=" w-screen h-screen items-center">
            <div class=" w-screen h-screen flex flex-col gap-10 justify-center items-center p-28">
            <p class=" text-7xl text-slate-900 font-bold font-varela mb-5">Begin your <span class=" text-blue-500">Eduquest</span> today!</p>
            <div class="flex gap-3">
                <Button class=" p-2 rounded font-notosans font-bold text-slate-100 bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                    <NuxtLink to="/quest">Get Started</NuxtLink>
                </Button>
                <Button class="p-2 rounded font-notosans font-bold text-slate-100 bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                    <a href="https://github.com/EduquestAI/Eduquest-Qubitx" target="_blank">Learn More</a>
                </Button>
            </div>
        </div>
        </div>
    </div>
</template>