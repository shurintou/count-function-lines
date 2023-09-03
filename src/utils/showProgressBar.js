/** 
 * To show process in console.
 * @param {number} totalSteps
 * @param {number} currentStep
 * @returns {void}
 */
function showProgressBar(totalSteps, currentStep) {
    const progressBarLength = 40
    const progress = currentStep / totalSteps
    const filledBarLength = Math.round(progress * progressBarLength)
    const emptyBarLength = progressBarLength - filledBarLength
    const filledBar = "█".repeat(filledBarLength)
    const emptyBar = "░".repeat(emptyBarLength)
    const percentageProgress = Math.round(progress * 100)
    const statusStr = percentageProgress === 100 ? 'Finished' : 'Counting...'

    process.stdout.write(`${statusStr}: [${filledBar}${emptyBar}] ${percentageProgress}% (${currentStep}/${totalSteps})  \r`)

    if (percentageProgress === 100) process.stdout.write('\n')

}

export default showProgressBar