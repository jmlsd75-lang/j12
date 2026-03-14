#include <stdio.h>
int main()
{
    int n; int ch; int choose; int type; int amount; int choice; int way; char detail[50];
    printf("JAMAL SAID KAZEMBE MULTI-SYSTEM MANAGEMENT\n\n");
    printf("1. BUSINESS\n");
    printf("0. EXIT\n");
    printf("enter your choice\n");
    scanf("%d", &choice);
    if (choice == 1 )
    {
        while (1)
        {
        printf("1. add new transaction\n");
        printf("2. view\n");
        printf("0. exit\n");
        printf("enter your choice\n");
        scanf("%d", &n);
        if (n == 1)
        {
            printf("enter detail\n");
            scanf("%s", detail);
            printf("enter amount\n");
            scanf(" %d", &amount);
            printf("1. in\n ");
            printf("2. out\n");
            printf("enter your choice\n");
            scanf("%d", &way);
            printf("1. cash\n");
            printf("2. bank\n");
            printf("3. credit\n");
            printf("enter your choice");
            scanf("%d", &type);
            printf("1. ok\n");
            printf("0. cancel\n");
            scanf("%d", &choose);
            if (choose == 1)
            {
                printf("transaction recorded successfull\n");
            }
             else if (choose == 0)
            {
                printf("transaction cancelled\n");
            }
            else 
            {
                printf("you have entered the invalid choice\n");
               }
           }
           if (n == 2)
           {
            printf("1. list");
            printf("0. exit");
            printf("enter your choice");
            scanf("%d", &ch);
            if (ch == 1)
            {
                printf("detail : %s\n", detail);
                printf("amount : %d\n", amount);
                printf("way : %d\n", way);
                printf("type : %d\n", type);
            }
           }
        }
    }

    else if (choice == 0)
    {
        printf("thank you for use our program");
    }
    else
    {
        printf("you have entered invalid choice");
    }
    
    return 0;
}