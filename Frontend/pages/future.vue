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
        <div class="h-screen w-screen flex justify-center items-center">
            <div class=" flex flex-col gap-5">
                <p class="text-4xl font-varela font-bold">Features in the Pipeline:</p>
                <p class="text-xl font-notosans">
                    • Profiles
                    <br>
                    • Classrooms
                    <br>
                    • Music
                    <br>
                    • Specialized Curriculums
                    <br>
                    • More Grades
                    <br>
                    • More Efficient Prompts
                    <br>
                    • AI Tutor
                    <br>
                    • Essay Questions
                    <br>
                    And More . . . 
                </p>
                <button class=" p-2 rounded font-notosans font-bold text-slate-100 bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                    <NuxtLink to="/quest">Get Started</NuxtLink>
                </button>
            </div>
        </div>
    </div>
</template>