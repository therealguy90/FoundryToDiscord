export function splitEmbed(embed) {
    const maxLength = 4000;
    let description = embed.description;
    const parts = [];

    let isFirstEmbed = true;

    while (description.length > maxLength) {
        let splitIndex = maxLength;

        // Find the nearest newline character before the maxLength
        while (splitIndex >= 0 && description[splitIndex] !== "\n") {
            splitIndex--;
        }

        // If no newline character is found, find the nearest whitespace character
        if (splitIndex < 0) {
            splitIndex = maxLength;
            while (splitIndex >= 0 && description[splitIndex] !== " ") {
                splitIndex--;
            }
        }

        // If no whitespace character is found, split at the maxLength
        if (splitIndex < 0) {
            splitIndex = maxLength;
        }

        // Split the description and create a new embed
        const partDescription = description.substring(0, splitIndex);
        const partEmbed = { ...embed, description: partDescription };

        // Remove the title from subsequent embeds
        if (!isFirstEmbed) {
            delete partEmbed.title;
            delete partEmbed.author;
        }

        // Add the part embed to the array
        parts.push(partEmbed);

        // Remove the processed part from the original description
        description = description.substring(splitIndex + 1);

        isFirstEmbed = false;
    }

    // Create the final embed with the remaining description
    const finalEmbed = { ...embed, description };

    // Remove the title from the final embed
    delete finalEmbed.title;
    delete finalEmbed.author;
    // Add the final embed to the array
    parts.push(finalEmbed);

    return parts;
}

export function hexToColor(hex) {
    // Remove the '#' character if it exists at the beginning of the hex string
    hex = hex.replace(/^#/, '');

    // Parse the hex string into a decimal number
    const decimalColor = parseInt(hex, 16);

    return decimalColor;
}

export function removeEmptyEmbeds(embeds){
    return embeds.filter(embed => embed.title || embed.description || !embed.footer);
}