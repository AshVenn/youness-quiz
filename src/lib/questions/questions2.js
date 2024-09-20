export const questions = [
    {
      text: "1. Quelle est la taille typique d'un entier (`int`) en C sur une architecture 32 bits ?",
      options: ["A. 2 octets", "B. 4 octets", "C. 8 octets", "D. 16 octets"],
      correctAnswer: 1
    },
    {
      text: "2. Quelle fonction est utilisée pour allouer dynamiquement de la mémoire en C ?",
      options: ["A. malloc", "B. calloc", "C. realloc", "D. free"],
      correctAnswer: 0
    },
    {
      text: "3. Quel mot-clé est utilisé pour déclarer une fonction qui ne retourne aucune valeur en C ?",
      options: ["A. void", "B. int", "C. char", "D. static"],
      correctAnswer: 0
    },
    {
      text: "4. Quelle est la valeur de retour de la fonction `strcmp` lorsqu'elle compare deux chaînes identiques ?",
      options: ["A. Un entier négatif", "B. Zéro", "C. Un entier positif", "D. Indéfini"],
      correctAnswer: 1
    },
    {
      text: "5. Quel opérateur est utilisé pour accéder aux membres d'une structure via un pointeur en C ?",
      options: ["A. .", "B. ->", "C. ::", "D. *"],
      correctAnswer: 1
    },
    {
      text: "6. Quelle est la complexité temporelle de la recherche dans une liste chaînée simplement liée ?",
      options: ["A. O(1)", "B. O(log n)", "C. O(n)", "D. O(n log n)"],
      correctAnswer: 2
    },
    {
      text: "7. Quel type de boucle en C est garanti de s'exécuter au moins une fois ?",
      options: ["A. for", "B. while", "C. do-while", "D. switch"],
      correctAnswer: 2
    },
    {
      text: "8. Quel est le résultat de l'expression `5 / 2` en C si les deux opérandes sont des entiers ?",
      options: ["A. 2", "B. 2.5", "C. 2.0", "D. 3"],
      correctAnswer: 0
    },
    {
      text: "9. Quelle est la bonne façon de déclarer un tableau de 10 entiers en C ?",
      options: ["A. int array[10];", "B. int array[10] = {};", "C. int array[] = {10};", "D. int array[10]();"],
      correctAnswer: 0
    },
    {
      text: "10. Quel est le rôle de la fonction `malloc` en C ?",
      options: ["A. Libérer de la mémoire allouée", "B. Allouer de la mémoire", "C. Redimensionner la mémoire allouée", "D. Initialiser une variable"],
      correctAnswer: 1
    },
    {
      text: "11. Quelle est la complexité temporelle de l'insertion dans un tableau trié en C ?",
      options: ["A. O(1)", "B. O(n)", "C. O(n^2)", "D. O(log n)"],
      correctAnswer: 1
    },
    {
      text: "12. Quel est le principal avantage des tableaux dynamiques par rapport aux tableaux statiques en C ?",
      options: ["A. Taille fixe", "B. Taille dynamique", "C. Moins de mémoire utilisée", "D. Plus rapide"],
      correctAnswer: 1
    },
    {
      text: "13. Quelle est la complexité spatiale d'une pile implémentée avec un tableau en C ?",
      options: ["A. O(1)", "B. O(n)", "C. O(n log n)", "D. O(log n)"],
      correctAnswer: 1
    },
    {
      text: "14. Quelle est la différence principale entre une pile (stack) et une file (queue) ?",
      options: ["A. Les éléments sont ajoutés et retirés du même côté", "B. Les éléments sont ajoutés à l'avant et retirés de l'arrière", "C. Les éléments sont ajoutés à l'arrière et retirés de l'avant", "D. Aucune différence"],
      correctAnswer: 2
    },
    {
      text: "15. Quelle structure de données est utilisée pour implémenter la récursion en C ?",
      options: ["A. Pile", "B. File", "C. Arbre", "D. Aucun des précédents"],
      correctAnswer: 0
    },
    {
      text: "16. Quel algorithme de tri a une complexité moyenne de O(n log n) ?",
      options: ["A. O(n)", "B. O(n log n)", "C. O(n^2)", "D. O(log n)"],
      correctAnswer: 1
    },
    {
      text: "17. Quel est l'objectif principal de l'algorithme de tri rapide (quicksort) ?",
      options: ["A. Trier les éléments en utilisant une approche divide et conquer", "B. Trouver le minimum et le placer en début de tableau", "C. Diviser le tableau en sous-tableaux plus petits et les trier récursivement", "D. Aucun des précédents"],
      correctAnswer: 2
    },
    {
      text: "18. Quelle est la complexité temporelle du tri par insertion dans le meilleur des cas ?",
      options: ["A. O(n)", "B. O(log n)", "C. O(n log n)", "D. O(1)"],
      correctAnswer: 0
    },
    {
      text: "19. Quel algorithme de recherche est le plus efficace sur un tableau trié ?",
      options: ["A. Recherche linéaire", "B. Recherche binaire", "C. Recherche par interpolation", "D. Recherche exponentielle"],
      correctAnswer: 1
    },
    {
      text: "20. Quelle est la complexité temporelle de l'algorithme de tri par sélection ?",
      options: ["A. O(n)", "B. O(n log n)", "C. O(n^2)", "D. O(log n)"],
      correctAnswer: 2
    },
    {
      text: "21. Quel est le rôle de la fonction `free` en C ?",
      options: ["A. Libérer la mémoire allouée", "B. Allouer de la mémoire", "C. Redimensionner la mémoire allouée", "D. Initialiser une variable"],
      correctAnswer: 0
    },
    {
      text: "22. Quel est l'opérateur utilisé pour obtenir l'adresse d'une variable en C ?",
      options: ["A. &", "B. *", "C. ->", "D. #"],
      correctAnswer: 0
    },
    {
      text: "23. Quelle est la bonne façon de déclarer un pointeur vers un entier en C ?",
      options: ["A. int *p;", "B. int p*;", "C. *int p;", "D. int &p;"],
      correctAnswer: 0
    },
    {
      text: "24. Quel est le comportement de l'opérateur `sizeof` appliqué à un type de données en C ?",
      options: ["A. Retourne la taille en octets", "B. Retourne la taille en bits", "C. Retourne la taille en éléments", "D. Ne retourne rien"],
      correctAnswer: 0
    },
    {
      text: "25. Quelle est la différence entre `==` et `=` en C ?",
      options: ["A. Comparer deux valeurs et assigner", "B. Comparer deux valeurs", "C. Assigner une valeur", "D. Aucune différence"],
      correctAnswer: 0
    },
    {
      text: "26. Quel est le rôle de la fonction `realloc` en C ?",
      options: ["A. Allouer de la mémoire supplémentaire", "B. Libérer la mémoire allouée", "C. Réinitialiser la mémoire", "D. Copier la mémoire"],
      correctAnswer: 0
    },
    {
      text: "27. Quelle est la complexité temporelle de l'accès à un élément dans un tableau en C ?",
      options: ["A. O(1)", "B. O(n)", "C. O(n log n)", "D. O(log n)"],
      correctAnswer: 0
    },
    {
      text: "28. Quel est le principal inconvénient des listes chaînées par rapport aux tableaux en C ?",
      options: ["A. Moins de mémoire utilisée", "B. Accès plus rapide aux éléments", "C. Insertion plus rapide des éléments", "D. Aucune différence"],
      correctAnswer: 2
    },
    {
      text: "29. Quelle est la complexité temporelle de la suppression d'un élément dans une liste chaînée simplement liée ?",
      options: ["A. O(1)", "B. O(n)", "C. O(n log n)", "D. O(log n)"],
      correctAnswer: 1
    },
    {
      text: "30. Quel est le rôle du mot-clé `static` lorsqu'il est utilisé pour une variable locale en C ?",
      options: ["A. Les variables ne peuvent pas être modifiées", "B. Les variables peuvent être modifiées", "C. Les variables sont statiques", "D. Les variables sont globales"],
      correctAnswer: 0
    },
    {
      text: "31. Quelle est la différence entre une variable globale et une variable locale en C ?",
      options: ["A. Les variables sont accessibles partout", "B. Les variables sont limitées au bloc où elles sont déclarées", "C. Les variables sont toujours constantes", "D. Les variables ne peuvent pas être modifiées"],
      correctAnswer: 1
    },
    {
      text: "32. Quelle est la bonne manière de passer un tableau à une fonction en C ?",
      options: ["A. Passer l'adresse du tableau", "B. Passer une copie du tableau", "C. Passer le premier élément du tableau", "D. Passer la taille du tableau"],
      correctAnswer: 0
    },
    {
      text: "33. Quelle est la complexité temporelle de la recherche binaire ?",
      options: ["A. O(1)", "B. O(log n)", "C. O(n)", "D. O(n log n)"],
      correctAnswer: 1
    },
    {
      text: "34. Quel est le rôle de la fonction `calloc` en C ?",
      options: ["A. Allouer de la mémoire et l'initialiser à zéro", "B. Allouer de la mémoire sans l'initialiser", "C. Libérer la mémoire allouée", "D. Redimensionner la mémoire allouée"],
      correctAnswer: 0
    },
    {
      text: "35. Quelle est la bonne façon de déclarer une fonction qui retourne un pointeur vers un entier en C ?",
      options: ["A. int *fonction();", "B. int (*fonction)();", "C. int *fonction*();", "D. int &fonction();"],
      correctAnswer: 0
    },
    {
      text: "36. Quelle est la différence entre `struct` et `union` en C ?",
      options: ["A. Les membres partagent le même espace mémoire", "B. Les membres ont des espaces mémoire séparés", "C. `struct` ne peut contenir qu'un seul membre", "D. `union` ne peut contenir qu'un seul membre"],
      correctAnswer: 0
    },
    {
      text: "37. Quelle est la complexité temporelle de l'ajout d'un élément au début d'une liste chaînée ?",
      options: ["A. O(1)", "B. O(n)", "C. O(n log n)", "D. O(log n)"],
      correctAnswer: 0
    },
    {
      text: "38. Quelle est la principale caractéristique des arbres binaires de recherche ?",
      options: ["A. Tous les nœuds ont au plus deux enfants", "B. Tous les nœuds ont exactement deux enfants", "C. Les nœuds sont ordonnés de gauche à droite", "D. Aucun des précédents"],
      correctAnswer: 0
    },
    {
      text: "39. Quel est le rôle de la fonction `strcpy` en C ?",
      options: ["A. Copier une chaîne de caractères", "B. Déplacer une chaîne de caractères", "C. Comparer deux chaînes de caractères", "D. Calculer la longueur d'une chaîne de caractères"],
      correctAnswer: 0
    },
    {
      text: "40. Quel est l'effet de l'utilisation du mot-clé `const` avec un pointeur en C ?",
      options: ["A. Le pointeur ne peut pas être modifié", "B. La valeur pointée ne peut pas être modifiée", "C. Les deux, le pointeur et la valeur pointée, ne peuvent pas être modifiés", "D. Aucun effet"],
      correctAnswer: 1
    },
    {
      text: "41. Quelle est la complexité temporelle de l'accès au dernier élément d'une liste chaînée simplement liée ?",
      options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n log n)"],
      correctAnswer: 1
    },
    {
      text: "42. Quel est le principal avantage des arbres équilibrés par rapport aux arbres binaires de recherche non équilibrés ?",
      options: ["A. Utilisation moindre de la mémoire", "B. Complexité temporelle garantie pour les opérations", "C. Plus facile à implémenter", "D. Aucun avantage"],
      correctAnswer: 1
    },
    {
      text: "43. Quelle est la complexité temporelle de l'insertion dans un arbre binaire de recherche équilibré ?",
      options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n log n)"],
      correctAnswer: 2
    },
    {
      text: "44. Quelle fonction est utilisée pour lire une ligne de texte depuis l'entrée standard en C ?",
      options: ["A. scanf", "B. gets", "C. fgets", "D. read"],
      correctAnswer: 2
    },
    {
      text: "45. Quel est le comportement de la fonction `strcat` en C ?",
      options: ["A. Compare deux chaînes de caractères", "B. Copie une chaîne de caractères", "C. Concatène deux chaînes de caractères", "D. Trouve la longueur d'une chaîne de caractères"],
      correctAnswer: 2
    },
    {
      text: "46. Quelle est la complexité temporelle de l'algorithme de tri par bulle (bubble sort) ?",
      options: ["A. O(n)", "B. O(n log n)", "C. O(n^2)", "D. O(log n)"],
      correctAnswer: 2
    },
    {
      text: "47. Quelle est la différence entre `malloc` et `calloc` en C ?",
      options: ["A. `malloc` initialise la mémoire à zéro, `calloc` ne le fait pas", "B. `calloc` initialise la mémoire à zéro, `malloc` ne le fait pas", "C. `malloc` alloue un seul bloc de mémoire, `calloc` plusieurs", "D. Aucune différence"],
      correctAnswer: 1
    },
    {
      text: "48. Quel est le rôle de la fonction `strlen` en C ?",
      options: ["A. Calculer la longueur d'une chaîne de caractères", "B. Copier une chaîne de caractères", "C. Concaténer deux chaînes de caractères", "D. Comparer deux chaînes de caractères"],
      correctAnswer: 0
    },
    {
      text: "49. Quelle est la bonne façon de déclarer une fonction récursive en C ?",
      options: ["A. Une fonction qui s'appelle elle-même", "B. Une fonction qui appelle une autre fonction", "C. Une fonction sans retour", "D. Une fonction avec des paramètres globaux"],
      correctAnswer: 0
    },
    {
      text: "50. Quelle est la complexité temporelle de la fusion dans l'algorithme de tri fusion (merge sort) ?",
      options: ["A. O(n)", "B. O(n log n)", "C. O(log n)", "D. O(n^2)"],
      correctAnswer: 0
    },
    {
      text: "51. Quelle est la principale utilisation des tables de hachage en C ?",
      options: ["A. Trier des éléments", "B. Rechercher des éléments rapidement", "C. Stocker des éléments en ordre", "D. Parcourir des éléments séquentiellement"],
      correctAnswer: 1
    },
    {
      text: "52. Quel est le rôle de la fonction `exit` en C ?",
      options: ["A. Terminer l'exécution du programme", "B. Revenir à la fonction précédente", "C. Réinitialiser les variables globales", "D. Aucune des réponses"],
      correctAnswer: 0
    },
    {
      text: "53. Quelle est la différence entre une liste doublement chaînée et une liste simplement chaînée ?",
      options: ["A. Une liste doublement chaînée peut être parcourue dans les deux sens", "B. Une liste simplement chaînée est plus efficace", "C. Une liste doublement chaînée utilise moins de mémoire", "D. Aucune différence"],
      correctAnswer: 0
    },
    {
      text: "54. Quelle est la complexité temporelle de la recherche dans un arbre binaire de recherche non équilibré ?",
      options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n log n)"],
      correctAnswer: 1
    },
    {
      text: "55. Quelle est la différence entre une pile implémentée avec un tableau et une pile implémentée avec une liste chaînée ?",
      options: ["A. Une pile implémentée avec un tableau a une taille fixe", "B. La pile avec une liste chaînée a une taille fixe", "C. Les deux implémentations ont une taille fixe", "D. Aucune différence"],
      correctAnswer: 0
    },
    {
      text: "56. Quel est le rôle de la fonction `fopen` en C ?",
      options: ["A. Ouvrir un fichier", "B. Lire un fichier", "C. Écrire dans un fichier", "D. Fermer un fichier"],
      correctAnswer: 0
    },
    {
      text: "57. Quelle est la complexité temporelle de l'algorithme de Dijkstra pour les graphes avec une file de priorité implémentée par un tas binaire ?",
      options: ["A. O(V^2)", "B. O(E log V)", "C. O(V log V)", "D. O(E + V)"],
      correctAnswer: 1
    },
    {
      text: "58. Quel est l'objectif principal de l'algorithme de parcours en profondeur (DFS) dans un graphe ?",
      options: ["A. Trouver le plus court chemin", "B. Visiter tous les nœuds du graphe", "C. Trier les nœuds du graphe", "D. Trouver les cycles dans le graphe"],
      correctAnswer: 1
    },
    {
      text: "59. Quelle est la complexité temporelle de l'algorithme de tri heap sort ?",
      options: ["A. O(n)", "B. O(n log n)", "C. O(n^2)", "D. O(log n)"],
      correctAnswer: 1
    },
    {
      text: "60. Quelle est la différence entre une file de priorité et une file normale en C ?",
      options: ["A. Une file de priorité traite les éléments en FIFO", "B. Une file de priorité traite les éléments en fonction de leur priorité", "C. Une file normale traite les éléments en fonction de leur priorité", "D. Aucune différence"],
      correctAnswer: 1
    },
    {
      text: "61. Quel est le rôle de la fonction `fclose` en C ?",
      options: ["A. Ouvrir un fichier", "B. Fermer un fichier", "C. Lire un fichier", "D. Écrire dans un fichier"],
      correctAnswer: 1
    },
    {
      text: "62. Quelle est la complexité temporelle de l'insertion dans une table de hachage bien équilibrée ?",
      options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n log n)"],
      correctAnswer: 0
    },
    {
      text: "63. Quelle est la différence entre une structure et un type énuméré (`enum`) en C ?",
      options: ["A. Une structure peut contenir différents types de données, `enum` ne peut contenir que des entiers", "B. Une structure ne peut contenir que des entiers, `enum` peut contenir différents types de données", "C. Les deux sont identiques", "D. Aucune différence"],
      correctAnswer: 0
    },
    {
      text: "64. Quel est le rôle de la fonction `fprintf` en C ?",
      options: ["A. Lire à partir d'un fichier", "B. Écrire dans un fichier", "C. Fermer un fichier", "D. Ouvrir un fichier"],
      correctAnswer: 1
    },
    {
      text: "65. Quelle est la complexité temporelle de la suppression dans une table de hachage ?",
      options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n log n)"],
      correctAnswer: 0
    },
    {
      text: "66. Quelle est la différence entre une queue circulaire et une queue linéaire en C ?",
      options: ["A. Une queue circulaire utilise moins de mémoire", "B. Une queue circulaire permet de réutiliser l'espace libéré", "C. Une queue linéaire est plus efficace", "D. Aucune différence"],
      correctAnswer: 1
    },
    {
      text: "67. Quel est le rôle de la fonction `fscanf` en C ?",
      options: ["A. Écrire dans un fichier", "B. Lire à partir d'un fichier", "C. Fermer un fichier", "D. Ouvrir un fichier"],
      correctAnswer: 1
    },
    {
      text: "68. Quelle est la complexité temporelle de la recherche dans une table de hachage avec des collisions gérées par chaînage ?",
      options: ["A. O(1) en moyenne", "B. O(n) en moyenne", "C. O(log n) en moyenne", "D. O(n log n) en moyenne"],
      correctAnswer: 0
    },
    {
      text: "69. Quelle est la différence entre une fonction `inline` et une fonction régulière en C ?",
      options: ["A. Une fonction `inline` est compilée en code machine à l'appel", "B. Une fonction `inline` ne peut pas avoir de paramètres", "C. Une fonction `inline` retourne toujours un entier", "D. Aucune différence"],
      correctAnswer: 0
    },
    {
      text: "70. Quel est le rôle de la fonction `sprintf` en C ?",
      options: ["A. Lire une chaîne de caractères depuis l'entrée standard", "B. Écrire une chaîne de caractères dans un fichier", "C. Formater et stocker une chaîne de caractères dans une variable", "D. Copier une chaîne de caractères"],
      correctAnswer: 2
    },
    {
      text: "71. Quelle est la complexité temporelle de l'algorithme de recherche linéaire dans un tableau non trié ?",
      options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n log n)"],
      correctAnswer: 1
    },
    {
      text: "72. Quelle est la différence entre une variable `volatile` et une variable non `volatile` en C ?",
      options: ["A. Une variable `volatile` peut être optimisée par le compilateur", "B. Une variable `volatile` ne peut pas être optimisée par le compilateur", "C. Une variable `volatile` est constante", "D. Aucune différence"],
      correctAnswer: 1
    },
    {
      text: "73. Quel est le rôle de la fonction `memcpy` en C ?",
      options: ["A. Copier une chaîne de caractères", "B. Comparer deux blocs de mémoire", "C. Copier un bloc de mémoire vers un autre", "D. Initialiser un bloc de mémoire"],
      correctAnswer: 2
    },
    {
      text: "74. Quelle est la complexité temporelle de l'algorithme de recherche binaire dans le pire des cas ?",
      options: ["A. O(1)", "B. O(n)", "C. O(log n)", "D. O(n log n)"],
      correctAnswer: 2
    },
    {
      text: "75. Quelle est la différence entre une macro et une fonction en C ?",
      options: ["A. Une macro est évaluée à la compilation, une fonction à l'exécution", "B. Une macro ne peut pas prendre de paramètres", "C. Une fonction est plus rapide qu'une macro", "D. Aucune différence"],
      correctAnswer: 0
    },
    {
      text: "76. Quel est le rôle de la fonction `atoi` en C ?",
      options: ["A. Convertir une chaîne de caractères en entier", "B. Convertir un entier en chaîne de caractères", "C. Ajouter deux entiers", "D. Aucune des réponses"],
      correctAnswer: 0
    },
    {
      text: "77. Quelle est la complexité temporelle de l'algorithme de tri par insertion dans le pire des cas ?",
      options: ["A. O(1)", "B. O(n)", "C. O(n log n)", "D. O(n^2)"],
      correctAnswer: 3
    },
    {
      text: "78. Quelle est la différence entre `malloc` et `alloca` en C ?",
      options: ["A. `malloc` alloue de la mémoire sur la pile, `alloca` sur le tas", "B. `alloca` alloue de la mémoire sur la pile, `malloc` sur le tas", "C. Les deux allouent de la mémoire sur le tas", "D. Les deux allouent de la mémoire sur la pile"],
      correctAnswer: 1
    },
    {
      text: "79. Quel est le rôle de la fonction `strncpy` en C ?",
      options: ["A. Copier une chaîne de caractères jusqu'à un nombre maximum de caractères", "B. Concaténer deux chaînes de caractères", "C. Comparer deux chaînes de caractères", "D. Calculer la longueur d'une chaîne de caractères"],
      correctAnswer: 0
    },
    {
      text: "80. Quelle est la complexité temporelle de l'algorithme de tri par sélection dans le pire des cas ?",
      options: ["A. O(1)", "B. O(n)", "C. O(n log n)", "D. O(n^2)"],
      correctAnswer: 3
    }
  ];
  