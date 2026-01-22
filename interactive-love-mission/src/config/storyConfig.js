export const storyConfig = {
    recipientName: "Zeynep",
    senderName: "Emre",
    specialDate: "12.05.2018",
    theme: "proposal", // Options: 'proposal', 'anniversary', 'birthday', 'just_because'

    scenes: {
        intro: {
            title: "A special mission has begun...",
            subtitle: "Someone you love is waiting for you.",
            buttonText: "Start the mission"
        },
        personalIntro: {
            greeting: "Hey {name},",
            message: "today you have one important mission.",
            subtext: "Follow your heart and continue.",
            buttonText: "Continue"
        },
        storyStart: {
            text: "Your love story didn’t start by chance.",
            subtext: "Every moment led you here."
        },
        choice: {
            title: "Which path will you choose?",
            optionA: "Follow the memories",
            optionB: "Trust your heart"
        },
        emotion: {
            text: "You remembered the moments that made you smile.",
            subtext: "{date} will always mean something special."
        },
        message: {
            content: "Zeynep, since the day we met, my life has been a beautiful adventure. I can't imagine a future without you.",
            subtext: "This message was written just for you."
        },
        final: {
            heading: "Mission completed ❤️",
            subtext: "Your love is safe.",
            proposalText: "Will you marry me?",
            anniversaryText: "Happy Anniversary!",
            birthdayText: "Happy Birthday!",
            yesButton: "YES!",
            contactButton: "Send Reply"
        }
    }
};
