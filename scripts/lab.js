//global variables for user input
let username; //name of the user
let initialHypothesis, initialReasoning; //hypothesis/reasoning from round 1
let updatedHypothesis, updatedReasoning; //hypothesis/reasoning from round 2
let thirdHypothesis, thirdReasoning; //hypothesis/reasoning from round 3
let finalHypothesis, finalReasoning; //hypothesis/reasoning from round 4

//global variables for state tracking
const states = {
    SETUP: 0,               //initial setup; ask for student's name
    INITIAL_HYPOTHESIS: 1,  //unlock 4 emails; form 1st tentative hypothesis
    UPDATED_HYPOTHESIS: 2,  //unlock 4 more emails; form 2nd tentative hypothesis
    THIRD_HYPOTHESIS: 3,    //unlock 2 final emails; form 3rd tentative hypothesis
    FINAL_HYPOTHESIS: 4,    //meet w/ other groups to compare data; form a final hypothesis
    END: 5                  //save user input & unlocked emails to PDF for assignment submission
};
let state = states.SETUP; //tracks where we are in the lab

//global variables for input elements
let hypoInputBox, reasonInputBox; //input boxes for hypothesis & reasoning
let hypoLabel, reasonLabel; //instructional text for hypothesis & reasoning boxes
let submitButton; //button used to submit hypothesis & reasoning

//load assets
function preload()
{
    //img_name = loadImage("assets/imgName.extension");
}

//perform initial page setup
function setup()
{
    //populate the email database
    /* TODO */

    //create the username box
    let nameLabel = spawnLabel("Enter your name: ");
    let nameInput = createInput();
    nameInput.parent(nameLabel);
    
    //create the submit button
    let nameButton = createButton("submit");
    nameButton.parent(nameLabel);
    nameButton.position(nameInput.x + nameInput.width, nameInput.y);
    let warnText = createP(); //text object to display warnings for invalid name input
    warnText.parent(nameButton);
    warnText.position(nameButton.width, -nameButton.height-5); //position the warning text next to the button. Gotta use a magic number to center it vertically because apparently warningText's height is 0 or something
    warnText.size(210); //make warnText large enough it won't try to wrap itself. More magic numbers (naughty!), but for the life of me I couldn't derive a size programatically so screw it.
    nameButton.mousePressed(() => {enterName(nameInput.value(), warnText);});
}

function draw()
{
    //If we're still in the setup state, 
    if (state == states.SETUP)
    {
        return;
    }

    if (hypoInputBox)
    {
        //console.log(hypoInputBox.value());
    }
    background(128);
}



//runs when user updates their name.
//The first time it's called, it also unlocks the first 4 emails.
//args: name = name of user; warningText = optional text object (from createP() call) used to display "invalid input" warnings
function enterName(name, warningText)
{
    if (name.length == 0) //simple check to make sure they entered a name
    {
        console.log("No name entered!");
        if (warningText) //if warningText was specified, use it to display an "invalid input" message
        {
            warningText.html("<p style=\"color:red;\">You must enter a name to proceed!</p>");
        }
    }
    else
    {
        username = name;
        if (warningText) //if warningText was specified, clear it
        {
            warningText.html("");
        }
        if (state == states.SETUP) //if this is the first time they entered their name, spawn in the rest of the page & transition to the next state.
        {
            console.log("Time to begin lab!");
            state = states.INITIAL_HYPOTHESIS;
            //create the email menu canvas
            spawnLabel("These are your currently unlocked emails. Click on an image to view it full-size; click again to return to the normal menu view.");
            let canvas = createCanvas(800,400);
            canvas.parent("container");
            
            //create the input boxes for hypothesis & reasoning
            hypoLabel = spawnLabel("Observe the information on the emails. Try to form a tentative hypothesis that explains the storyline represented by the emails. Enter this hypothesis in the box below.");
            hypoInputBox = spawnTextArea("","container",800,100);
            reasonLabel = spawnLabel("Using evidence from the emails, explain your reasoning behind the storyline you created.");
            reasonInputBox = spawnTextArea("","container",800,100);

            //create the "submit" button
            spawnLabel("Press the button below when you're ready to move to the next step.")
            submitButton = createButton("submit");
            submitButton.parent("container");
            submitButton.mousePressed(submitHypothesis);
        }
    }
}

//helper function to spawn a text entry area.
//Args: initialText = initial text to display in the box; parent = what object to parent it to; width & height = width & height of the area
function spawnTextArea(initialText, parent, width, height)
{
    let newArea = createElement("textarea",initialText);
    newArea.parent(parent);
    newArea.size(width,height);
    return newArea;
}

//helper function to spawn a <p></p> text element, mostly intended for use in labeling other fields in the page.
//Args: text = HTML text to display; parent = what object to parent it to (optional, defaults to "container")
function spawnLabel(text, parent)
{
    let newLabel = createP();
    newLabel.html(text);
    if (parent)
    {
        newLabel.parent(parent);
    }
    else
    {
        newLabel.parent("container");
    }
    return newLabel;
}

//saves the user's hypothesis & reasoning & transitions to the next state.
function submitHypothesis()
{
    switch(state)
    {
        case states.INITIAL_HYPOTHESIS: //entered 1st hypothesis after seeing 1st 4 emails
            if(checkHypothesis()) //confirm hypothesis/reasoning was entered
            {
                console.log("Saved 1st hypothesis; unlocking 4 more emails");
                //save the hypothesis/reasoning
                initialHypothesis = hypoInputBox.value();
                initialReasoning = reasonInputBox.value();
                console.log(initialHypothesis);
                console.log(initialReasoning);
                //unlock 4 more emails
                /*TODO*/

                //update the hypothesis/reasoning labels w/ the prompt for the 2nd hypothesis
                hypoLabel.html("Using the new data from the 4 new emails, formulate a second tentative hypothesis that explains the storyline.");
                reasonLabel.html("Explain your reasoning behind the storyline you created, including how you integrated new data into your hypothesis.")

                //move to next state
                state = states.UPDATED_HYPOTHESIS;
            }
            break;
        case states.UPDATED_HYPOTHESIS: //entered 2nd hypothesis after seeing 4 new emails
            if(checkHypothesis(initialHypothesis, initialReasoning)) //confirm hypothesis/reasoning was entered & updated
            {
                console.log("Saved 2nd hypothesis; unlocking 2 more emails");
                //save the new hypothesis/reasoning
                updatedHypothesis = hypoInputBox.value();
                updatedReasoning = reasonInputBox.value();
                console.log(updatedHypothesis);
                console.log(updatedReasoning);
                //unlock 2 more emails
                /*TODO*/

                //update the hypothesis/reasoning labels w/ the prompt for the 3rd hypothesis
                hypoLabel.html("Using the new data from the 2 new emails, formulate a third tentative hypothesis that explains the storyline.");
                //reasonLabel.html("Explain your reasoning behind the storyline you created, including how you integrated new data into your hypothesis.")

                //move to next state
                state = states.THIRD_HYPOTHESIS;
            }
            break;
        case states.THIRD_HYPOTHESIS: //entered 3rd hypothesis after seeing final 2 emails
            if(checkHypothesis(updatedHypothesis, updatedReasoning)) //confirm hypothesis/reasoning was entered & updated
            {
                console.log("Saved 3rd hypothesis; it's time to share!");
                //save the new hypothesis/reasoning
                thirdHypothesis = hypoInputBox.value();
                thirdReasoning = reasonInputBox.value();
                console.log(thirdHypothesis);
                console.log(thirdReasoning);

                /* Maybe save to PDF here to facilitate sharing without
                   relying on the student using screensharing or whatever?*/
                
                //update the hypothesis/reasoning labels w/ the prompt for the 4th hypothesis
                hypoLabel.html("To simulate the collaborative nature of science, take a few minutes to meet with other groups to compare data."
                     + " Remember, since each group received emails at random, groups may have different data."
                     + "<br>When you've finished sharing, formulate a final hypothesis based upon all the available data."
                     + " This hypothesis should attempt to explain the events in the life of the character(s) who wrote the emails.");
                //reasonLabel.html("Explain your reasoning behind the storyline you created, including how you integrated new data into your hypothesis.")

                //move to next state
                state = states.FINAL_HYPOTHESIS;
            }
            break;
        case states.FINAL_HYPOTHESIS: //entered 4th & final hypothesis after sharing w/ another group
            if(checkHypothesis(thirdHypothesis, thirdReasoning)) //confirm hypothesis/reasoning was entered & updated
            {
                console.log("Saved final hypothesis; time to print to PDF");
                //save the new hypothesis/reasoning
                finalHypothesis = hypoInputBox.value();
                finalReasoning = reasonInputBox.value();
                console.log(finalHypothesis);
                console.log(finalReasoning);
                
                //save to PDF
                /*TODO*/

                //move to next state
                state = states.END;
            }
            break;
        default:
            //
    }
}

//performs a simple error-check of a hypothesis/reasoning submission
//(specifically, checks that neither was blank and that both were updated since the last submission).
//Args: the previous hypothesis & reasoning from the prior step of the lab (optional, used to make sure the student updates their thinking with the new data)
function checkHypothesis(previousHypothesis, previousReasoning)
{
    if (hypoInputBox.value() == "") //did they forget their hypothesis?
    {
        alert("You didn't submit a hypothesis!");
        return false;
    }
    else if (reasonInputBox.value() == "") //did they forget their reasoning?
    {
        alert("You didn't submit any reasoning!");
        return false;
    }
    else if (previousHypothesis && (hypoInputBox.value() == previousHypothesis)) //did they update their hypothesis?
    {
        alert("You haven't updated your hypothesis since the last stage.");
        return false;
    }
    else if (previousReasoning && (reasonInputBox.value() == previousReasoning)) //did they update their reasoning?
    {
        alert("You haven't updated your reasoning since the last stage.");
        return false;
    }
    else
    {
        return true;
    }
}