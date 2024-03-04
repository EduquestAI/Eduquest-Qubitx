<!-- Apologies in advanced for anyone reading this. It's gotta be my most atrocious code as it was very rushed due to hackathon completion purposes -->
<script setup lang="ts">
    import { ref } from 'vue'
    import { Progress } from '@/components/ui/progress'
    import scienceicon from '~/assets/svg/science.svg'
    import mathicon from '~/assets/svg/math.svg'
    import historyicon from '~/assets/svg/history.svg'
    import readingicon from '~/assets/svg/reading.svg'
    import writingicon from '~/assets/svg/writing.svg'
    import customicon from '~/assets/svg/custom.svg'
    import { Button } from '@/components/ui/button'
    import { Input } from '@/components/ui/input'
    import { Label } from '@/components/ui/label'
    import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
    import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
    import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    } from '@/components/ui/alert-dialog'

    let step = ref(1);
    let section = ref('choices')
    let interest = ref('');
    let grade = ref('');
    let subjectfile = ref('');

    const questions = ref([])

    export interface Question {
        difficulty: string;
        question: string;
        type: string;
        hint: string;
        choices: string[];
        answer: string;
    }

    let questionPosition = ref(0);
    let questionCycles = 0
    let showHint = ref(false);
    let showSkip = ref(false);
    let fetching = ref(false);
    let generating = ref(false);
    let correctornot = ref(JSON.parse(`{
        "title": "",
        "message": ""
    }`))
    

    async function getQuestions(regen: boolean): Promise<Question[]> {
        if(regen == true){
            generating.value = false;
            const response: string = await $fetch(`http://localhost:3001/generate/${interest.value}`, {
                method: 'POST',
                body: {
                    "level": grade.value,
                    "subject": subjectfile.value,
                    "position": questionCycles
                }
            })
            const data = JSON.parse(response);
            questions.value = data.questions;
            console.log(response);
            generating.value = false;
            fetching.value = false;
            return questions.value;
        }
        else{
            generating.value = true;
            const response: string = await $fetch(`http://localhost:3001/generate/${interest.value}`, {
                method: 'POST',
                body: {
                    "level": grade.value,
                    "subject": subjectfile.value,
                    "position": questionCycles
                }
            })
            const data = JSON.parse(response);
            questions.value = data.questions;
            console.log(response);
            generating.value = false;
            fetching.value = false;
            return questions.value;
        }
        
    }

    async function checkAnswer(choice: string, question: any) {
        if(choice == question.answer){
            correctornot.value.title = "Correct!";
            showHint.value = false;
            showSkip.value = false;
        }
        else{
            correctornot.value.title = "Sorry, that's not correct.";
            correctornot.value.message = `The correct answer is: ${question.answer}`;
        }
      }
    async function skipAnswer(question: any){
        showHint.value = false;
        showSkip.value = false;
        questionPosition.value++;
        if(questionPosition.value >= 5){
            console.log("Fetching More questions...")
            questionCycles+=5;
            fetching.value = true;
            await getQuestions(true);
            fetching.value = false;
            questionPosition.value = 0;
        }
    }
    function goBack(question: any){
        questionPosition.value--;
        if(questionPosition.value < 0){
            questionPosition.value = 0;
        }
    }
    function changeTheme(){
        section.value='choices';
        step.value=2;
        generating.value = true;
    }

</script>

<template>
    <div class="w-screen h-screen flex items-center flex-col justify-between bg-gradient-radial from-[#f3fffa]  to-black to-[450%]"  v-if="section == 'choices'">
        <a href="#">
            <eduquest class=" mt-5 " />
        </a>
        <div>
            <Transition mode="out-in">
                <div class="flex items-center flex-col justify-between gap-10 h-[40rem]" v-if="step==1">
                    <formheader :question="'What would you like to practice?'" />
                    <div class="flex flex-wrap items-center justify-center gap-10 max-w-[800px] mt-2">
                        <button @click="step = 2; subjectfile = 'math.txt'"><subject :subject="'Math'" :svg=mathicon /></button>
                        <button @click="step = 2; subjectfile = 'elastory.txt'"><subject :subject="'Reading'" :svg=readingicon /></button>
                        <button @click="step = 2; subjectfile = 'history.txt'"><subject :subject="'History'" :svg=historyicon /></button>
                        <button @click="step = 2; subjectfile = 'science.txt'"><subject :subject="'Science'" :svg=scienceicon /></button>
                        <button @click="step = 2; subjectfile = 'ela.txt'"><subject :subject="'English'" :svg=writingicon /></button>
                        <NuxtLink to="/future"><subject :subject="'Custom'" :svg=customicon /></NuxtLink>
                    </div>
                </div>
            </Transition>
            <Transition mode="out-in">
                <div class="flex items-center flex-col justify-between gap-10 h-[40rem]" v-if="step==2">
                    <formheader :question="'What are you interested in?'" />
                    <div class="bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] opacity-100 w-[18rem] h-[10rem] rounded-[10px] shadow-xl flex flex-col items-center justify-center gap-3">
                        <Input v-model:model-value="interest" class="w-[15rem]" type="email" placeholder="spiderman" />
                        <div class="flex justify-between w-[15rem]">
                            <Button @click="step = 1;" variant="outline">Back</Button>
                            <Button @click="if(interest!=''){step = 3;}">Next</Button>
                        </div>
                    </div>
                    <div></div>
                </div>
            </Transition>
            <Transition mode="out-in">
                <div class="flex items-center flex-col justify-between gap-10 h-[40rem]" v-if="step==3">
                    <formheader :question="'What grade are you in?'" />
                    <div class="bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] opacity-100 w-[15rem] h-[19rem] rounded-[10px] shadow-xl flex flex-col items-center justify-center gap-3">
                        <RadioGroup class="bg-background p-4 rounded-md" v-model:model-value="grade">
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem  id="r1" value="kindergarten" />
                                <Label for="r1">Kindergarten</Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem  id="r2" value="first" />
                                <Label for="r2">1st</Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem  id="r3" value="second" />
                                <Label for="r3">2nd</Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem  id="r4" value="third" />
                                <Label for="r4">3rd</Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem  id="r5" value="fourth" />
                                <Label for="r5">4th</Label>
                            </div>
                            <div class="flex items-center space-x-2">
                                <RadioGroupItem  id="r6" value="fifth" />
                                <Label for="r6">5th</Label>
                            </div>
                        </RadioGroup>
                        <div class="flex justify-center gap-[0.8rem] w-[15rem]">
                            <Button @click="step = 2;" variant="outline">Back</Button>
                            <Button @click="if(grade!=''){step = 4;}">Next</Button>
                        </div>
                    </div>
                    <div></div>
                </div>
            </Transition>
            <Transition mode="out-in">
                <div class="flex items-center flex-col justify-between gap-10 h-[40rem]" v-if="step==4">
                    <formheader :question="'Ready to practice?'" />                        
                    <button @click="getQuestions(false); section = 'questions'" class="w-[10rem] h-[4rem] text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-2xl px-5 py-2.5 text-center me-2 mb-2">Let's Go!</button>
                    <div></div>
                </div>
            </Transition>
        </div>
        
        <Progress class=" bg-slate-300 w-1/4 mb-32" :model-value=step*25 />
    </div>

    <div v-if="section == 'questions'" class="w-screen h-screen flex items-center flex-col justify-between bg-gradient-radial from-[#f3fffa]  to-black to-[450%]" >
        <a href="#">
            <eduquest class=" mt-5 " />
        </a>
        <div>
            <div v-if="generating == true" class="w-[18rem] h-[20rem] p-5 rounded-[10px] flex flex-col justify-between bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                <div class="flex flex-col gap-4">
                    <p class=" text-xl font-bold font-notosans text-slate-100">Cranking the gears...</p>
                    <p class=" font-bold font-notosans text-slate-100">We're getting your content ready! This may take up to 15 seconds. If nothing appears by that time click the "Retry" button below and wait another 15 seconds.</p>
                </div>
                <Button @click="getQuestions(false);">Retry</Button>
            </div>
            <div v-if="fetching == true" class="w-[18rem] h-[20rem] p-5 rounded-[10px] flex flex-col justify-between bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa]">
                <div class="flex flex-col gap-4">
                    <p class=" text-xl font-bold font-notosans text-slate-100">Cranking more gears...</p>
                    <p class=" font-bold font-notosans text-slate-100">We're getting your content ready! Again, if nothing appears after ~15 seconds then hit retry. Also if you want to change your inputted interest click "Change Theme"!</p>
                </div>
                <div class="flex gap-2">
                    <Button @click="getQuestions(true);">Retry</Button>
                    <Button @click="changeTheme();">Change Theme</Button>
                </div>
            </div>
            <div v-if="fetching!=true && generating!=true">
                <div v-for="question in questions" :key="question.question">
                    <div v-if="subjectfile != 'history.txt'">
                        <div v-if="question.offset == questionPosition" :style="{ backgroundImage: `url(${ question.image })` }" class=" rounded-[10px] w-[45rem] bg-cover bg-center">
                            <div class=" h-full w-full backdrop-blur-lg flex flex-col gap-4 rounded-[10px] p-6 bg-[rgba(0,0,0,0.2)]">
                                <div v-if="subjectfile == 'elastory.txt'" class="flex flex-col gap-2">
                                    <p class=" font-notosans text-slate-100">Read the story below and answer the questions.</p>
                                    <p class=" bg-slate-100 text-slate-800 p-2 rounded text-xl">{{ question.story }}</p>
                                </div>
                                <div class="card">
                                <div class="card-header">
                                    <div class="flex gap-2 items-center">
                                        <p class=" font-notosans text-slate-100 font-bold text-lg">{{ question.question }}</p> 
                                        
                                    </div>    
                                </div>
                                <div class="card-body">
                                    <ul class="flex gap-5 flex-wrap items-center justify-center py-3">
                                        <li v-for="choice in question.choices" :key="choice">
                                            <AlertDialog>
                                                <AlertDialogTrigger as-child>
                                                <button @click="checkAnswer(choice, question);" class=" w-[20rem] h-5 py-8 rounded bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] flex items-center justify-center font-notosans text-lg font-bold text-slate-100">
                                                    {{ choice }}
                                                </button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>{{ correctornot.title }}</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        {{ correctornot.message }}
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel><a href="https://eduquest.me">Go Home</a></AlertDialogCancel>
                                                    <AlertDialogAction @click="skipAnswer(question)">Continue</AlertDialogAction>
                                                </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </li>
                                    </ul>
                                    <div class="flex gap-3 py-5">
                                        <AlertDialog>
                                            <AlertDialogTrigger as-child>
                                            <Button variant="outline">
                                                Hint
                                            </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Here's a Hint if you need help</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    {{ question.hint }}
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Thanks</AlertDialogCancel>
                                            </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <AlertDialog>
                                            <AlertDialogTrigger as-child>
                                            <Button variant="outline">
                                                Not Working?
                                            </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Not Working?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                Sometimes the buttons can be a bit finicky since Eduquest is still in its prototyping phase, so if needed, you can skip this question. But keep in mind you won't recieve the answer as this should only be used if there aren't working buttons.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction @click="skipAnswer(question)">Skip</AlertDialogAction>
                                            </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                        <div v-if="subjectfile != 'elastory.txt'" class=" bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] text-slate-100 rounded-full flex items-center justify-center p-2">
                                            <p class="font-notosans font-bold">{{ question.type }}</p>
                                        </div>
                                        <div class=" bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] text-slate-100 rounded-full flex items-center justify-center p-2">
                                            <p class="font-notosans font-bold">{{ question.difficulty }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                    <div v-if="subjectfile == 'history.txt'">
                        <div v-if="question.offset == questionPosition" :style="{ backgroundImage: `url(${ question.image })` }" class=" rounded-[10px] w-[45rem] bg-cover bg-center">
                            <div class=" h-full w-full backdrop-blur-lg flex flex-col gap-4 rounded-[10px] p-6 bg-[rgba(0,0,0,0.2)]">
                            <p class="font-notosans text-slate-100 font-bold text-3xl text-center">{{ question.strategyTitle }}</p>    
                            <div class="flex gap-3 py-5 justify-center items-center">
                                <div class=" bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] text-slate-100 rounded-full flex items-center justify-center p-2">
                                    <p class="font-notosans font-bold">{{ question.topic }}</p>
                                </div>
                                <div class=" bg-gradient-to-b from-[#61d0f6] from-[-80%] hover:from-[-65%] to-[#5845fa] text-slate-100 rounded-full flex items-center justify-center p-2">
                                    <p class="font-notosans font-bold">{{ question.strategy }}</p>
                                </div>
                            </div> 
                            <div class="p-5 bg-[rgba(220,20,60,0.3)] rounded flex flex-col gap-3">
                                <p class=" text-white font-notosans font-bold">Strategy</p>
                                <p class="text-white font-notosans">{{ question.usecase }}</p>
                            </div>
                            <div class="p-5 bg-[rgba(255,255,51,0.3)] rounded flex flex-col gap-3">
                                <p class=" text-white font-notosans font-bold">Example</p>
                                <p class="text-white font-notosans">{{ question.example }}</p>
                            </div>
                            <div class="p-5 bg-[rgba(30,144,255,0.3)] rounded flex flex-col gap-3">
                                <p class="text-white font-notosans">Tip: {{ question.example }}</p>
                            </div>
                            <div class="flex gap-3 justify-end">
                                <Button><a href="https://eduquest.me">Go Home</a></Button>
                                <Button variant="outline" @click="goBack(question)">Back</Button>
                                <Button variant="outline" @click="skipAnswer(question)">Next</Button>
                            </div>    
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div></div>
    </div>

</template>

<style scoped>

    .v-enter-active{
        transition: all 1.2s ease;
    }
    .v-leave-active {
        transition: all 1.2s ease;
        position: absolute;
    }

    .v-enter-from {
        transform: translateX(100%);
        opacity: 0;
    }
    .v-leave-to {
        transform: translateX(-100%);
        opacity: 0;
        position: absolute;
    }

</style>