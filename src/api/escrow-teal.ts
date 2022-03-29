export function escrow(app_id: number) {
    return `#pragma version 3

    
    // deploy app first then get id
    // replace id in this teal to create
    // the escrow address
    // use goal app update to set the
    // escrow address
    
    // Verify grouping with ApplicationCall
    global GroupSize
    int 2
    ==
    
    gtxn 1 TypeEnum
    int appl
    ==
    &&
    
    // The specific App ID must be called
    // This should be changed after creation
    gtxn 1 ApplicationID
    int ${app_id}
    ==
    &&
    
    // App Call must be noop
    gtxn 1 OnCompletion
    int NoOp
    ==
    
    // Delete must empty the escrow if it has any funds
    gtxn 1 OnCompletion
    int DeleteApplication
    ==
    ||
    &&
    
    // verify neither transaction
    // contains a rekey
    gtxn 0 RekeyTo
    global ZeroAddress
    ==
    &&
    gtxn 1 RekeyTo
    global ZeroAddress
    ==
    &&
    `
} 
    