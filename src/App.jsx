import React, { useState, useEffect, useRef } from 'react';
import { Terminal, Book, FileText, HardDrive, Lock, Command, CheckCircle, HelpCircle, Award, ArrowRight, Zap, Star, Rocket } from 'lucide-react';

const TerminalQuest = () => {
  // State for managing lessons, progress, and terminal
  const [activeLesson, setActiveLesson] = useState('intro');
  const [terminalHistory, setTerminalHistory] = useState([
    { type: 'system', content: 'Welcome to Terminal Quest! Your adventure begins now.' }
  ]);
  const [input, setInput] = useState('');
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isLessonComplete, setIsLessonComplete] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  // Lesson data structure
  const lessons = {
    intro: {
      title: "Introduction to the Terminal",
      icon: <Rocket size={24} />,
      content: `Welcome to Terminal Quest! Today you'll learn about the command line, a powerful way to talk to your computer.

The terminal (or command line) is like a text-based control center for your computer. Instead of clicking on pictures (icons), you type commands to tell the computer what to do.

Why learn the terminal?
• It's powerful - you can do things that aren't possible with regular clicking
• It's faster once you learn it
• It's everywhere - from tiny computers to huge servers
• It makes you feel like a computer wizard!`,
      hint: "Type exactly: echo \"Hello World\" and press Enter. The echo command displays text on the screen.",
      tasks: [
        { 
          command: 'echo "Hello World"', 
          output: 'Hello World',
          explanation: 'The echo command displays text on the screen.'
        },
        { 
          command: 'date', 
          output: new Date().toLocaleString(),
          explanation: 'The date command shows the current date and time.'
        },
        { 
          command: 'whoami', 
          output: 'user',
          explanation: 'The whoami command shows your username.'
        }
      ],
      commands: ['echo', 'date', 'whoami']
    },
    navigation: {
      title: "Navigating the File System",
      icon: <HardDrive size={24} />,
      content: `In this lesson, you'll learn how to move around your computer's file system using the terminal.

Just like folders on your desktop, the terminal lets you navigate through directories (folders) to find your files.

Here are the essential navigation commands:
• pwd - Print Working Directory (shows where you are)
• ls - List (shows what files and folders are in your current location)
• cd - Change Directory (moves you to a different folder)`,
      hint: "Type exactly: pwd and press Enter. This will show you your current location in the file system.",
      tasks: [
        { 
          command: 'pwd', 
          output: '/home/user',
          explanation: 'pwd shows your current directory (location).'
        },
        { 
          command: 'ls', 
          output: 'Documents  Downloads  Pictures  Music  Videos',
          explanation: 'ls lists all files and folders in your current directory.'
        },
        { 
          command: 'cd Documents', 
          output: 'Changed to /home/user/Documents',
          explanation: 'cd changes your current directory to the one you specify.'
        },
        { 
          command: 'ls', 
          output: 'homework.txt  project.pdf  notes.md',
          explanation: 'Now we see the contents of the Documents directory.'
        },
        { 
          command: 'cd ..', 
          output: 'Changed to /home/user',
          explanation: 'cd .. moves you up one directory (to the parent folder).'
        }
      ],
      commands: ['pwd', 'ls', 'cd']
    },
    files: {
      title: "Working with Files",
      icon: <FileText size={24} />,
      content: `Now let's learn how to create, view, and manage files using the terminal.

These commands will help you work with files:
• touch - Creates a new, empty file
• cat - Shows the contents of a file
• cp - Copies a file
• mv - Moves or renames a file
• rm - Removes (deletes) a file`,
      hint: "Type exactly: touch myfile.txt and press Enter. This creates a new empty file called myfile.txt.",
      tasks: [
        { 
          command: 'touch myfile.txt', 
          output: 'File created: myfile.txt',
          explanation: 'touch creates a new empty file.'
        },
        { 
          command: 'echo "Hello, this is my file" > myfile.txt', 
          output: 'Text written to myfile.txt',
          explanation: 'This adds text to our file. The > redirects the output of echo into the file.'
        },
        { 
          command: 'cat myfile.txt', 
          output: 'Hello, this is my file',
          explanation: 'cat displays the contents of a file.'
        },
        { 
          command: 'cp myfile.txt myfilecopy.txt', 
          output: 'File copied to myfilecopy.txt',
          explanation: 'cp makes a copy of a file.'
        },
        { 
          command: 'mv myfile.txt renamed.txt', 
          output: 'File renamed to renamed.txt',
          explanation: 'mv can rename a file (or move it to a different location).'
        }
      ],
      commands: ['touch', 'cat', 'cp', 'mv', 'echo >']
    },
    permissions: {
      title: "File Permissions",
      icon: <Lock size={24} />,
      content: `In this lesson, you'll learn about file permissions - who's allowed to read, write, or execute files on your computer.

In Unix-like systems (like Linux and macOS), each file has three types of permissions:
• r - Read (can view the file)
• w - Write (can modify the file)
• x - Execute (can run the file as a program)

And these permissions apply to three groups:
• Owner (you)
• Group (other users in your group)
• Others (everyone else)`,
      hint: "Type exactly: ls -l and press Enter. The -l option shows the 'long format' with permission details.",
      tasks: [
        { 
          command: 'ls -l', 
          output: 'total 12\n-rw-r--r-- 1 user user 24 Apr 1 10:00 myfilecopy.txt\n-rw-r--r-- 1 user user 22 Apr 1 10:01 renamed.txt',
          explanation: 'ls -l shows detailed information including permissions. The "rw-r--r--" part shows the permissions.'
        },
        { 
          command: 'touch script.sh', 
          output: 'File created: script.sh',
          explanation: 'We created a shell script file.'
        },
        { 
          command: 'echo "echo Hello from script" > script.sh', 
          output: 'Text written to script.sh',
          explanation: 'We added a simple command to our script.'
        },
        { 
          command: 'chmod +x script.sh', 
          output: 'Execution permission added to script.sh',
          explanation: 'chmod +x adds execution permission, allowing the file to be run as a program.'
        },
        { 
          command: 'ls -l script.sh', 
          output: '-rwxr-xr-x 1 user user 20 Apr 1 10:05 script.sh',
          explanation: 'Now the permissions include "x" (execute) for all users.'
        }
      ],
      commands: ['ls -l', 'chmod']
    },
    pipes: {
      title: "Pipes and Redirects",
      icon: <Command size={24} />,
      content: `One of the most powerful features of the terminal is the ability to connect commands together using pipes and redirects.

These special operators help you:
• | (pipe) - Takes the output of one command and sends it to another command
• > (redirect) - Sends the output of a command to a file (overwrites the file)
• >> (append) - Adds the output of a command to the end of a file`,
      hint: "Type exactly: echo \"Line 1\" > multiline.txt and press Enter. This creates a file with one line of text.",
      tasks: [
        { 
          command: 'echo "Line 1" > multiline.txt', 
          output: 'Text written to multiline.txt',
          explanation: '> redirects output to a file (creates or overwrites).'
        },
        { 
          command: 'echo "Line 2" >> multiline.txt', 
          output: 'Text appended to multiline.txt',
          explanation: '>> appends output to a file (adds to the end).'
        },
        { 
          command: 'echo "Line 3" >> multiline.txt', 
          output: 'Text appended to multiline.txt',
          explanation: 'We\'ve added another line.'
        },
        { 
          command: 'cat multiline.txt', 
          output: 'Line 1\nLine 2\nLine 3',
          explanation: 'cat shows the full content of our file.'
        },
        { 
          command: 'cat multiline.txt | grep "Line 2"', 
          output: 'Line 2',
          explanation: 'The pipe | sends the output of cat to grep, which searches for a pattern.'
        }
      ],
      commands: ['|', '>', '>>', 'grep']
    }
  };

  // Handle user input in terminal
  const handleInput = (e) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    }
  };

  // Process commands entered by the user
  const processCommand = (cmd) => {
    // Add command to terminal history
    setTerminalHistory(prev => [
      ...prev, 
      { type: 'input', content: cmd }
    ]);

    const lessonData = lessons[activeLesson];
    const currentTask = lessonData.tasks[currentTaskIndex];

    // Check if command matches current task
    if (cmd.toLowerCase() === currentTask.command.toLowerCase()) {
      // Add command output to terminal
      setTerminalHistory(prev => [
        ...prev,
        { type: 'output', content: currentTask.output },
        { type: 'success', content: `Great job! ${currentTask.explanation}` }
      ]);

      // Update completed tasks
      setCompletedTasks(prev => [...prev, currentTaskIndex]);

      // Show animation briefly
      setShowAnimation(true);
      setTimeout(() => setShowAnimation(false), 1000);

      // Move to next task or complete lesson
      if (currentTaskIndex < lessonData.tasks.length - 1) {
        setCurrentTaskIndex(currentTaskIndex + 1);
        
        const nextTask = lessonData.tasks[currentTaskIndex + 1];
        setTerminalHistory(prev => [
          ...prev,
          { type: 'next', content: `Next, try: ${nextTask.command}` }
        ]);
      } else {
        // Lesson complete
        setIsLessonComplete(true);
        setShowSuccess(true);
        setTerminalHistory(prev => [
          ...prev,
          { type: 'celebration', content: `🎉 Mission Complete! You've mastered ${lessonData.title}!` }
        ]);
      }
    } else if (cmd === 'clear') {
      // Clear terminal
      setTerminalHistory([{ type: 'system', content: 'Terminal cleared.' }]);
    } else if (cmd === 'help') {
      // Show help message
      setTerminalHistory(prev => [
        ...prev,
        { type: 'system', content: `
Try these commands:
- The current task: ${currentTask.command}
- clear: Clears the terminal
- help: Shows this help message`
        }
      ]);
    } else {
      // Invalid command
      setTerminalHistory(prev => [
        ...prev,
        { type: 'error', content: `Command not recognized or not the one we're looking for right now.` },
        { type: 'hint', content: `Hint: Try ${currentTask.command}` }
      ]);
    }
  };

  // Change to a different lesson
  const changeLesson = (lessonId) => {
    setActiveLesson(lessonId);
    setCurrentTaskIndex(0);
    setCompletedTasks([]);
    setShowSuccess(false);
    setIsLessonComplete(false);
    setTerminalHistory([
      { type: 'system', content: `Starting lesson: ${lessons[lessonId].title}` },
      { type: 'next', content: `Try: ${lessons[lessonId].tasks[0].command}` }
    ]);
  };

  // Calculate progress for current lesson
  const calculateProgress = () => {
    return (completedTasks.length / lessons[activeLesson].tasks.length) * 100;
  };

  // Typewriter effect for instructions
  useEffect(() => {
    const currentText = lessons[activeLesson].content;
    let i = 0;
    setTypingText('');
    setIsTyping(true);

    const typing = setInterval(() => {
      if (i < currentText.length) {
        setTypingText(prev => prev + currentText.charAt(i));
        i++;
      } else {
        clearInterval(typing);
        setIsTyping(false);
      }
    }, 10); // Speed of typing

    return () => clearInterval(typing);
  }, [activeLesson]);

  // Auto scroll terminal
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory]);

  // Focus input when lesson changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [activeLesson, currentTaskIndex]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-200">
      {/* Animated background */}
      <div className="fixed top-0 left-0 right-0 bottom-0 overflow-hidden z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-black"></div>
        {/* Floating code symbols */}
        <div className="absolute top-1/4 left-1/4 text-pink-500/10 text-6xl">$</div>
        <div className="absolute top-3/4 left-2/3 text-pink-500/10 text-6xl">{`{`}</div>
        <div className="absolute top-1/2 left-1/3 text-pink-500/10 text-6xl">{`}`}</div>
        <div className="absolute top-1/3 left-2/3 text-pink-500/10 text-6xl">~</div>
        <div className="absolute top-2/3 left-1/4 text-pink-500/10 text-6xl">./</div>
        <div className="absolute top-1/5 left-3/4 text-pink-500/10 text-6xl">|</div>
      </div>

      <style>
        {`
          @keyframes glow {
            0%, 100% { text-shadow: 0 0 5px rgba(219, 39, 119, 0.7); }
            50% { text-shadow: 0 0 20px rgba(219, 39, 119, 1), 0 0 30px rgba(219, 39, 119, 0.7); }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
          }
          
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          
          @keyframes rotate {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .cmd-glow {
            text-shadow: 0 0 5px #ff00ff;
          }
          
          .progress-glow {
            box-shadow: 0 0 10px rgba(255, 0, 255, 0.5);
          }
          
          .bounce-animation {
            animation: bounce 2s ease-in-out infinite;
          }
          
          .rotate-animation {
            animation: rotate 6s linear infinite;
          }
          
          .hover-card:hover {
            transform: translateY(-5px);
            transition: transform 0.3s ease;
          }
        `}
      </style>

      <header className="bg-gradient-to-r from-fuchsia-900 to-pink-900 text-white p-6 rounded-b-lg shadow-lg border-b border-fuchsia-700 relative z-10">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Terminal size={32} className="text-pink-400 rotate-animation" />
            <h1 className="text-3xl font-bold" style={{animation: "glow 2s ease-in-out infinite"}}>
              Terminal Quest
            </h1>
          </div>
          <p className="text-lg text-pink-200">Learn to use the command line - one adventure at a time!</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col md:flex-row gap-6 relative z-10">
        {/* Sidebar with lesson navigation */}
        <div className="md:w-64 bg-gray-800 rounded-lg shadow-lg p-4 h-fit border border-gray-700">
          <h2 className="text-xl font-bold mb-4 text-pink-400 flex items-center gap-2">
            <Book size={20} className="bounce-animation" />
            Missions
          </h2>
          <nav className="space-y-2">
            {Object.entries(lessons).map(([id, lesson]) => (
              <button
                key={id}
                onClick={() => changeLesson(id)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg transition hover-card ${
                  activeLesson === id
                    ? 'bg-gradient-to-r from-fuchsia-900 to-pink-900 text-white font-semibold border border-pink-500'
                    : 'hover:bg-gray-700 border border-transparent'
                }`}
              >
                <div className={activeLesson === id ? 'text-pink-300' : 'text-gray-400'}>
                  {lesson.icon}
                </div>
                <span>{lesson.title}</span>
                {completedTasks.length === lessons[id].tasks.length && activeLesson === id && (
                  <CheckCircle size={16} className="ml-auto text-green-400" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-grow flex flex-col md:flex-row gap-6">
          {/* Instructions panel */}
          <div className="md:w-1/2 bg-gray-800 rounded-lg shadow-lg p-6 flex flex-col border border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-pink-400 flex items-center gap-2">
              <div className="bounce-animation">
                {lessons[activeLesson].icon}
              </div>
              {lessons[activeLesson].title}
            </h2>
            
            <div className="prose prose-invert flex-grow text-gray-300">
              {typingText.split('\n').map((line, i) => (
                line === '' 
                  ? <br key={i} /> 
                  : <p key={i}>{line}</p>
              ))}
              {isTyping && <span className="animate-pulse text-pink-400">|</span>}
            </div>

            <div className="mt-4 border-t border-gray-700 pt-4">
              <p className="font-semibold mb-2 text-pink-300">Try this command:</p>
              <div className="bg-gray-900 p-3 rounded font-mono text-fuchsia-400 cmd-glow border border-gray-700">
                {lessons[activeLesson].tasks[currentTaskIndex].command}
              </div>
              
              <button 
                onClick={() => setShowHint(!showHint)}
                className="mt-4 flex items-center gap-2 text-pink-400 hover:text-pink-300 transition"
              >
                <HelpCircle size={16} />
                {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
              
              {showHint && (
                <div className="mt-2 p-3 bg-fuchsia-900/30 border-l-4 border-fuchsia-500 text-fuchsia-200 rounded">
                  {lessons[activeLesson].hint}
                </div>
              )}
            </div>
          </div>

          {/* Terminal panel */}
          <div className="md:w-1/2 flex flex-col">
            <div className="bg-gray-900 rounded-t-lg p-2 flex items-center border-t border-l border-r border-gray-700">
              <div className="flex gap-2 mr-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-gray-400 text-sm flex-grow text-center">Terminal</div>
            </div>
            
            <div 
              ref={terminalRef}
              className="bg-black rounded-b-lg p-4 h-96 overflow-y-auto font-mono text-sm border-b border-l border-r border-gray-700 relative"
            >
              {showAnimation && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <Zap size={60} className="text-fuchsia-400" style={{animation: "pulse 1s ease-in-out"}} />
                </div>
              )}
              
              {terminalHistory.map((entry, index) => (
                <div key={index} className={`mb-2 ${entry.type === 'input' ? 'pl-4' : ''}`}>
                  {entry.type === 'input' && (
                    <span className="text-green-400">user@quest:~$ </span>
                  )}
                  <span className={
                    entry.type === 'system' ? 'text-fuchsia-400' :
                    entry.type === 'error' ? 'text-red-400' :
                    entry.type === 'success' ? 'text-green-400' :
                    entry.type === 'next' ? 'text-yellow-400' :
                    entry.type === 'hint' ? 'text-purple-400' :
                    entry.type === 'celebration' ? 'text-pink-400 font-bold' :
                    'text-gray-200'
                  }>
                    {entry.content}
                  </span>
                </div>
              ))}
              
              <div className="flex mt-2">
                <span className="text-green-400">user@quest:~$ </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleInput}
                  className="bg-transparent border-none outline-none text-gray-200 font-mono flex-grow ml-2"
                  autoFocus
                />
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-6 bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold text-pink-400 flex items-center gap-2">
                  <Star size={16} className="bounce-animation" />
                  Mission Progress
                </h3>
                <span className="text-sm text-pink-200">{Math.round(calculateProgress())}%</span>
              </div>
              <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-gray-700">
                <div 
                  className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 transition-all duration-500 progress-glow"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              
              {/* Success message */}
              {showSuccess && (
                <div className="mt-4 p-4 bg-fuchsia-900/30 border-l-4 border-fuchsia-500 rounded">
                  <h4 className="font-bold text-pink-400 flex items-center gap-2">
                    <Award size={20} className="bounce-animation" />
                    Mission Complete!
                  </h4>
                  <p className="text-pink-300 mt-2">
                    You've mastered these commands:
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {lessons[activeLesson].commands.map(cmd => (
                      <span 
                        key={cmd} 
                        className="px-2 py-1 bg-fuchsia-900/50 text-pink-300 rounded text-sm font-mono border border-fuchsia-700"
                      >
                        {cmd}
                      </span>
                    ))}
                  </div>
                  
                  {/* Next lesson button */}
                  {Object.keys(lessons).indexOf(activeLesson) < Object.keys(lessons).length - 1 && (
                    <button
                      onClick={() => {
                        const keys = Object.keys(lessons);
                        const nextLesson = keys[keys.indexOf(activeLesson) + 1];
                        changeLesson(nextLesson);
                      }}
                      className="mt-4 bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:from-fuchsia-700 hover:to-pink-700 transition border border-pink-400 shadow-lg"
                    >
                      Next Mission
                      <ArrowRight size={16} />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-400 p-4 mt-8 border-t border-gray-800 relative z-10">
        <div className="container mx-auto text-center text-sm">
          <p className="flex items-center justify-center gap-2">
            <span>Terminal Quest</span>
            <span className="px-2">•</span>
            <span className="flex items-center gap-1">
              <Terminal size={14} className="text-pink-400" />
              Made for future hackers
            </span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TerminalQuest;
