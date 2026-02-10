def generate_study_plan():
    plan = """
**🎯 AI Study Planner**

You are an AI academic mentor. Generate a **personalized weekly study plan** based on the following input details.

**Student Profile:**
- Subject: Computer Science
- Level: Intermediate
- Goal: A+
- Learning Style: Visual
- Study Time: 2 hours per day (Morning)
- Focus Areas: Data Structures & Algorithms

**Weekly Breakdown:**
- **Week 1:** Foundations & Core Data Structures
  - **Monday:** Study arrays and linked lists (1 hour). Draw diagrams of array operations and linked list traversals using Draw.io. End with a 15-minute quiz on basic operations.
  - **Tuesday:** Explore stacks and queues (1 hour). Create flowcharts for stack push/pop and queue enqueue/dequeue using Lucidchart. Recap with visual examples.
  - **Wednesday:** Delve into trees (binary trees) (1 hour). Sketch tree structures and traversal diagrams (inorder, preorder). Code a simple tree visualization in Python.
  - **Thursday:** Review hash tables (1 hour). Illustrate hash functions and collision resolution with diagrams. Practice with visual coding demos in JavaScript.
  - **Friday:** Mixed review (1 hour). Combine concepts with a flowchart of data structure selection. End-of-week quiz on all topics.
  - **Weekend:** Light review or project idea brainstorming (30 minutes). Use Miro for planning a small visual project.

- **Week 2:** Algorithms & Problem Solving
  - **Monday:** Sorting algorithms (bubble, selection) (1 hour). Create step-by-step diagrams for each sort on sample arrays. Implement and visualize in Python.
  - **Tuesday:** Searching algorithms (binary search) (1 hour). Draw flowcharts for binary search process. Code and debug with visual output.
  - **Wednesday:** Recursion basics (1 hour). Use diagrams to explain recursive calls (e.g., factorial). Practice with coding exercises.
  - **Thursday:** Divide and Conquer (merge sort) (1 hour). Illustrate the divide-conquer-combine process with flowcharts. Visualize merge steps.
  - **Friday:** Problem-solving techniques (1 hour). Work on LeetCode problems with visual planning. End with recap quiz.
  - **Weekend:** Apply concepts to a small project (30 minutes). Build a visual demo of a sorting algorithm in JavaScript.

- **Week 3:** Intermediate Concepts
  - **Monday:** Graphs (BFS, DFS) (1 hour). Sketch graph representations and traversal diagrams. Use Draw.io for graph structures.
  - **Tuesday:** Dynamic Programming intro (1 hour). Diagram DP table for Fibonacci. Code with visual prints.
  - **Wednesday:** Trees advanced (BST, AVL) (1 hour). Illustrate balance and rotations with diagrams. Practice insertions visually.
  - **Thursday:** Heaps and priority queues (1 hour). Create flowcharts for heap operations. Code a priority queue demo.
  - **Friday:** Advanced problems (1 hour). Solve medium LeetCode with visual planning. Quiz on intermediate topics.
  - **Weekend:** Review and adjust (30 minutes). Use Canva to create a summary infographic.

- **Week 4:** Project & Review
  - **Monday:** Integrate concepts (1 hour). Plan a project involving multiple data structures (e.g., graph with heaps).
  - **Tuesday:** Build project (1 hour). Implement and visualize the project in Python or JavaScript.
  - **Wednesday:** Debug and optimize (1 hour). Use diagrams to trace issues. Test with visual outputs.
  - **Thursday:** Final review (1 hour). Go over all topics with flowcharts and quizzes.
  - **Friday:** Presentation prep (1 hour). Create a visual summary of the project and learnings using Miro.
  - **Weekend:** Full mock exam (1 hour). Simulate A+ level questions with visual aids.

**Daily Activities Focus:**
- Each session: 1-1.5 hours in the morning.
- Emphasize visual learning: Use diagrams, flowcharts, and coding visualizations.
- End-of-day: Short quiz or recap to reinforce.

**Tools and Visual Resources:**
- **Visual Tools:** Lucidchart, Draw.io, Canva, Miro for diagrams and flowcharts.
- **Programming Tools:** Python for implementations, JavaScript for interactive demos.
- **Additional Resources:** LeetCode for problems, Khan Academy for visual explanations.

**Notes for Customization and Progress Tracking:**
- Adjust based on progress; add more time if needed.
- Track daily: Note what was learned and any challenges.
- Weekly check-ins: Review quizzes and adjust plan.
- Encourage breaks and consistent practice for A+ goal.
"""
    print(plan.strip())  # Strip leading/trailing whitespace for clean output

if __name__ == "__main__":
    generate_study_plan()
