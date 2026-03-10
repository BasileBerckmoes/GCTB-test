---
description: Read and write to a dynamic JSON task list, used for organizing and executing tasks algorithmically.
---

# Task Management AI Skill

This skill provides a standardized approach for creating and managing a project's dynamic task list using JSON format. 

## Structure

The task lists are stored by default in `tasks/` at the root of the project.

There are primarily two types of tasks:
1. **Epic Tasks:** Groupings of features.
2. **Subtasks:** Granular units of work belonging to an epic.

### File Format: `tasks/active.json`
```json
{
  "project": "Project Name",
  "epics": [
    {
      "id": "epic-1",
      "title": "Setup Foundation",
      "status": "in-progress",
      "tasks": [
        {
          "id": "t-1",
          "description": "Initialize Repo",
          "status": "completed"
        },
        {
          "id": "t-2",
          "description": "Scaffold Database",
          "status": "pending"
        }
      ]
    }
  ]
}
```

## How to interact
As an AI Agent, when you are asked to "create a tasklist" or "manage tasks" using the JSON format:
1. Check if `tasks/active.json` exists in the current project root.
2. If it does not exist, use the boilerplate above to instantiate it.
3. To update a task: Read `tasks/active.json` using `view_file` or `cat`, determine the change locally, and then overwrite the file with `replace_file_content` or by echoing the updated JSON back out. 
4. Move tasks to "completed" as work is finished, or create new objects as the user dictates new requests.
