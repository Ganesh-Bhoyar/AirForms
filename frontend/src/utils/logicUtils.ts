export const shouldShowQuestion = (question: any, allAnswers: Record<string, any>) => {
    if (!question.conditions || question.conditions.length === 0) {
        return true;
    }

    // Group conditions by logic operator (AND/OR)
    // For simplicity in this assignment, we'll assume all conditions are combined with the same logic 
    // or we evaluate them sequentially. The requirement says "a logic operator (AND / OR) for combining multiple rules".
    // Let's assume the logic operator is defined per rule relative to the previous one, or globally.
    // The schema I defined has `logic` in each condition. Let's interpret it as: 
    // (Condition 1) [LOGIC 2] (Condition 2) [LOGIC 3] (Condition 3)...

    // However, usually the first condition doesn't need a logic operator.
    // Let's evaluate the first condition, then apply subsequent ones.

    let result = true;

    for (let i = 0; i < question.conditions.length; i++) {
        const condition = question.conditions[i];
        const answer = allAnswers[condition.questionKey];

        let conditionMet = false;

        switch (condition.operator) {
            case 'equals':
                conditionMet = answer == condition.value; // loose equality for string/number
                break;
            case 'notEquals':
                conditionMet = answer != condition.value;
                break;
            case 'contains':
                conditionMet = String(answer || '').includes(condition.value);
                break;
            default:
                conditionMet = false;
        }

        if (i === 0) {
            result = conditionMet;
        } else {
            if (condition.logic === 'OR') {
                result = result || conditionMet;
            } else {
                // Default to AND
                result = result && conditionMet;
            }
        }
    }

    return result;
};
