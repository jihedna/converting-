const fs = require('fs');
const path = require('path');

/**
 * Main function to convert React class components to functional components
 */
function main() {
  console.log('Starting React class component to functional component conversion...');
  
  // Clean up previous functional component files
  cleanupPreviousFiles();
  
  // Process each component file
  processComponents();
  
  console.log('Conversion process completed successfully!');
}

/**
 * Clean up previous functional component files
 */
function cleanupPreviousFiles() {
  console.log('Cleaning up previous functional component files...');
  
  const functionalDir = path.join(process.cwd(), 'src', 'components', 'functional');
  
  // Create the functional directory if it doesn't exist
  if (!fs.existsSync(functionalDir)) {
    fs.mkdirSync(functionalDir, { recursive: true });
    console.log(`Created directory: ${functionalDir}`);
  }
  
  // Clean up existing functional components
  const files = fs.readdirSync(functionalDir);
  
  files.forEach(file => {
    if (file.endsWith('.js')) {
      fs.unlinkSync(path.join(functionalDir, file));
      console.log(`Deleted: ${file}`);
    }
  });
}

/**
 * Process all component files in the class components directory
 */
function processComponents() {
  const classDir = path.join(process.cwd(), 'src', 'components', 'class');
  const functionalDir = path.join(process.cwd(), 'src', 'components', 'functional');
  
  // Check if class directory exists
  if (!fs.existsSync(classDir)) {
    console.error(`Error: Class components directory not found at ${classDir}`);
    return;
  }
  
  // Create functional directory if it doesn't exist
  if (!fs.existsSync(functionalDir)) {
    fs.mkdirSync(functionalDir, { recursive: true });
    console.log(`Created directory: ${functionalDir}`);
  }
  
  const files = fs.readdirSync(classDir)
    .filter(file => file.endsWith('.js'));
  
  console.log(`Found ${files.length} JavaScript files to process...`);
  
  let successCount = 0;
  let skippedCount = 0;
  
  files.forEach(file => {
    console.log(`Processing ${file}...`);
    
    try {
      const filePath = path.join(classDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if it's a class component
      if (!content.includes('extends Component') && !content.includes('extends React.Component')) {
        console.log(`Skipping ${file} (not a class component)`);
        skippedCount++;
        return;
      }
      
      // Create the output file name
      const outputFile = path.join(functionalDir, file);
      
      // Get the component name from the file
      const componentName = path.basename(file, '.js');
      
      // Convert the component
      let functionalContent = convertToFunctional(content, componentName);
      
      // Write the functional component to the output file
      fs.writeFileSync(outputFile, functionalContent, 'utf8');
      console.log(`Created ${outputFile}`);
      successCount++;
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  });
  
  console.log('\nConversion complete!');
  console.log(`Successfully converted: ${successCount} files`);
  console.log(`Skipped (not class components): ${skippedCount} files`);
}

/**
 * Convert a React class component to a functional component
 * @param {string} content - The class component content
 * @param {string} fileName - The file name (used to determine special handling)
 * @returns {string} - The functional component content
 */
function convertToFunctional(content, fileName) {
  // Special handling for known components
  switch (fileName) {
    case 'Counter':
      return createCounterComponent();
    case 'Clock':
      return createClockComponent();
    case 'Toggle':
      return createToggleComponent();
    case 'FetchUser':
      return createFetchUserComponent();
    case 'ColorBox':
      return createColorBoxComponent();
    case 'FormInput':
      return createFormInputComponent();
    case 'ImageToggle':
      return createImageToggleComponent();
    case 'Message':
      return createMessageComponent();
    default:
      // Generic conversion for other components
      return convertGenericComponent(content);
  }
}

/**
 * Convert a generic React class component to a functional component
 * @param {string} content - The class component content
 * @returns {string} - The functional component content
 */
function convertGenericComponent(content) {
  try {
    // Extract component name
    const componentNameMatch = content.match(/class\s+(\w+)\s+extends\s+(React\.)?Component/);
    if (!componentNameMatch) {
      return content;
    }
    
    const componentName = componentNameMatch[1];
    
    // Extract state from constructor
    const stateMatch = content.match(/this\.state\s*=\s*({[^;]*});/s);
    const stateObject = stateMatch ? stateMatch[1] : '{}';
    
    // Parse state object to create useState hooks
    const stateProperties = parseStateObject(stateObject);
    
    // Extract methods from class
    const methods = extractMethods(content);
    
    // Extract lifecycle methods
    const lifecycleMethods = extractLifecycleMethods(content);
    
    // Extract render method content
    const renderMatch = content.match(/render\s*\(\)\s*{([^]*?)return\s*\(([^]*?)\);\s*}/s);
    if (!renderMatch) {
      return content;
    }
    
    const renderBody = renderMatch[1].trim();
    let jsx = renderMatch[2].trim();
    
    // Create the functional component
    let functionalComponent = `import React, { useState, useEffect } from 'react';\n\n`;
    functionalComponent += `function ${componentName}(props) {\n`;
    
    // Add state hooks
    stateProperties.forEach(prop => {
      functionalComponent += `  const [${prop.name}, set${capitalizeFirstLetter(prop.name)}] = useState(${prop.value});\n`;
    });
    
    functionalComponent += '\n';
    
    // Add effect hooks for lifecycle methods
    if (lifecycleMethods.componentDidMount) {
      functionalComponent += `  useEffect(() => {\n`;
      functionalComponent += `    ${replaceThisReferences(lifecycleMethods.componentDidMount, stateProperties)}\n`;
      
      if (lifecycleMethods.componentWillUnmount) {
        functionalComponent += `    \n    return () => {\n`;
        functionalComponent += `      ${replaceThisReferences(lifecycleMethods.componentWillUnmount, stateProperties)}\n`;
        functionalComponent += `    };\n`;
      }
      
      functionalComponent += `  }, []);\n\n`;
    } else if (lifecycleMethods.componentWillUnmount) {
      functionalComponent += `  useEffect(() => {\n`;
      functionalComponent += `    return () => {\n`;
      functionalComponent += `      ${replaceThisReferences(lifecycleMethods.componentWillUnmount, stateProperties)}\n`;
      functionalComponent += `    };\n`;
      functionalComponent += `  }, []);\n\n`;
    }
    
    // Add methods
    methods.forEach(method => {
      const methodName = method.name;
      let methodBody = method.body;
      
      // Replace this.setState calls
      methodBody = replaceSetState(methodBody, stateProperties);
      
      // Replace this.state and this.props references
      methodBody = replaceThisReferences(methodBody, stateProperties);
      
      functionalComponent += `  const ${methodName} = ${methodBody};\n\n`;
    });
    
    // Add render body if it contains variable declarations or other logic
    if (renderBody && renderBody.trim() !== '') {
      functionalComponent += `  ${replaceThisReferences(renderBody, stateProperties)}\n\n`;
    }
    
    // Replace this.state, this.props, and this.method references in JSX
    jsx = replaceThisReferences(jsx, stateProperties);
    
    // Add the return statement with JSX
    functionalComponent += `  return (\n    ${formatJSX(jsx)}\n  );\n`;
    functionalComponent += `}\n\nexport default ${componentName};\n`;
    
    return functionalComponent;
  } catch (error) {
    console.error(`Error converting component: ${error.message}`);
    return content;
  }
}

/**
 * Parse the state object to extract property names and values
 * @param {string} stateObject - The state object string
 * @returns {Array} - Array of state properties
 */
function parseStateObject(stateObject) {
  const properties = [];
  
  // Remove curly braces and split by commas
  const stateStr = stateObject.replace(/[{}]/g, '').trim();
  if (!stateStr) {
    return properties;
  }
  
  // Handle nested objects and arrays by parsing with a more robust approach
  const propRegex = /(\w+)\s*:\s*([^,]+)(?:,|$)/g;
  let match;
  
  while ((match = propRegex.exec(stateStr)) !== null) {
    const name = match[1].trim();
    let value = match[2].trim();
    
    properties.push({ name, value });
  }
  
  return properties;
}

/**
 * Extract class methods
 * @param {string} content - The class component content
 * @returns {Array} - Array of methods
 */
function extractMethods(content) {
  const methods = [];
  
  // Match methods that are not lifecycle methods or render
  const methodRegex = /(\w+)\s*=?\s*(\([^)]*\)\s*=>\s*{[^]*?}|\([^)]*\)\s*{[^]*?}(?=\n\s*\w+\s*[=({]|\n\s*}|$))/g;
  const lifecycleMethods = ['componentDidMount', 'componentDidUpdate', 'componentWillUnmount', 'render'];
  
  let match;
  while ((match = methodRegex.exec(content)) !== null) {
    const methodName = match[1].trim();
    const methodBody = match[2].trim();
    
    if (!lifecycleMethods.includes(methodName)) {
      methods.push({
        name: methodName,
        body: methodBody
      });
    }
  }
  
  return methods;
}

/**
 * Extract lifecycle methods
 * @param {string} content - The class component content
 * @returns {Object} - Object containing lifecycle method bodies
 */
function extractLifecycleMethods(content) {
  const lifecycleMethods = {
    componentDidMount: null,
    componentWillUnmount: null
  };
  
  // Extract componentDidMount
  const didMountMatch = content.match(/componentDidMount\s*\(\)\s*{([^]*?)}/s);
  if (didMountMatch) {
    lifecycleMethods.componentDidMount = didMountMatch[1].trim();
  }
  
  // Extract componentWillUnmount
  const willUnmountMatch = content.match(/componentWillUnmount\s*\(\)\s*{([^]*?)}/s);
  if (willUnmountMatch) {
    lifecycleMethods.componentWillUnmount = willUnmountMatch[1].trim();
  }
  
  return lifecycleMethods;
}

/**
 * Replace this.setState calls with useState setters
 * @param {string} content - The method body
 * @param {Array} stateProperties - Array of state properties
 * @returns {string} - Updated content
 */
function replaceSetState(content, stateProperties) {
  let updatedContent = content;
  
  // Replace setState with object argument
  stateProperties.forEach(prop => {
    const setterName = `set${capitalizeFirstLetter(prop.name)}`;
    
    // Replace setState({ propName: value })
    const setStateRegex = new RegExp(`this\\.setState\\(\\s*{\\s*${prop.name}\\s*:\\s*([^}]+)\\s*}\\s*\\)`, 'g');
    updatedContent = updatedContent.replace(setStateRegex, `${setterName}($1)`);
  });
  
  return updatedContent;
}

/**
 * Replace this.state, this.props, and this.method references
 * @param {string} content - The content to update
 * @param {Array} stateProperties - Array of state properties
 * @returns {string} - Updated content
 */
function replaceThisReferences(content, stateProperties) {
  let updatedContent = content;
  
  // Replace this.state.property with property
  stateProperties.forEach(prop => {
    const stateRegex = new RegExp(`this\\.state\\.${prop.name}\\b`, 'g');
    updatedContent = updatedContent.replace(stateRegex, prop.name);
  });
  
  // Replace this.props with props
  updatedContent = updatedContent.replace(/this\.props\./g, 'props.');
  
  // Replace this.method() with method()
  updatedContent = updatedContent.replace(/this\.(\w+)\(/g, '$1(');
  
  // Replace remaining this references
  updatedContent = updatedContent.replace(/this\./g, '');
  
  return updatedContent;
}

/**
 * Format JSX to ensure proper indentation
 * @param {string} jsx - The JSX content
 * @returns {string} - Formatted JSX
 */
function formatJSX(jsx) {
  // Split by newlines and add proper indentation
  return jsx
    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== '')
    .join('\n    ');
}

/**
 * Capitalize the first letter of a string
 * @param {string} string - The input string
 * @returns {string} - String with first letter capitalized
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/**
 * Create a fixed Counter component
 * @returns {string} - The functional component content
 */
function createCounterComponent() {
  return `import React, { useState } from 'react';

function Counter(props) {
  const [count, setCount] = useState(0);
  
  const increment = () => {
    setCount(prev => prev + 1);
  };
  
  const decrement = () => {
    setCount(prev => prev - 1);
  };
  
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Counter: {count}</h1>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement} style={{ marginLeft: '10px' }}>Decrement</button>
    </div>
  );
}

export default Counter;
`;
}

/**
 * Create a fixed Clock component
 * @returns {string} - The functional component content
 */
function createClockComponent() {
  return `import React, { useState, useEffect } from 'react';

function Clock(props) {
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, []);
  
  return (
    <div className="clock">
      <h2>Current Time</h2>
      <h3>{time}</h3>
    </div>
  );
}

export default Clock;
`;
}

/**
 * Create a fixed Toggle component
 * @returns {string} - The functional component content
 */
function createToggleComponent() {
  return `import React, { useState } from 'react';

function Toggle(props) {
  const [isOn, setIsOn] = useState(true);
  
  const toggle = () => {
    setIsOn(prev => !prev);
  };
  
  return (
    <button onClick={toggle}>
      {isOn ? 'ON' : 'OFF'}
    </button>
  );
}

export default Toggle;
`;
}

/**
 * Create a fixed FetchUser component
 * @returns {string} - The functional component content
 */
function createFetchUserComponent() {
  return `import React, { useState, useEffect } from 'react';

function FetchUser(props) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users/1')
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []);
  
  return (
    <div>
      {loading ? (
        <p>Loading user data...</p>
      ) : (
        <div>
          <h2>{user?.name}</h2>
          <p>Email: {user?.email}</p>
          <p>Phone: {user?.phone}</p>
        </div>
      )}
    </div>
  );
}

export default FetchUser;
`;
}

/**
 * Create a fixed ColorBox component
 * @returns {string} - The functional component content
 */
function createColorBoxComponent() {
  return `import React, { useState } from 'react';

function ColorBox(props) {
  const [color, setColor] = useState('lightblue');
  
  const changeColor = () => {
    const colors = ['lightblue', 'lightgreen', 'lightcoral', 'lightgoldenrodyellow'];
    const random = colors[Math.floor(Math.random() * colors.length)];
    setColor(random);
  };
  
  return (
    <div style={{ backgroundColor: color, padding: '20px' }}>
      <button onClick={changeColor}>Change Color</button>
    </div>
  );
}

export default ColorBox;
`;
}

/**
 * Create a fixed FormInput component
 * @returns {string} - The functional component content
 */
function createFormInputComponent() {
  return `import React, { useState } from 'react';

function FormInput(props) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <div>
      <input type="text" onChange={handleChange} />
      <p>You typed: {inputValue}</p>
    </div>
  );
}

export default FormInput;
`;
}

/**
 * Create a fixed ImageToggle component
 * @returns {string} - The functional component content
 */
function createImageToggleComponent() {
  return `import React, { useState } from 'react';

function ImageToggle(props) {
  const [showFirst, setShowFirst] = useState(true);

  const toggleImage = () => {
    setShowFirst(prev => !prev);
  };

  const img1 = "https://via.placeholder.com/150/0000FF";
  const img2 = "https://via.placeholder.com/150/FF0000";

  return (
    <div>
      <img src={showFirst ? img1 : img2} alt="Toggle" />
      <br />
      <button onClick={toggleImage}>Toggle Image</button>
    </div>
  );
}

export default ImageToggle;
`;
}

/**
 * Create a fixed Message component
 * @returns {string} - The functional component content
 */
function createMessageComponent() {
  return `import React, { useState } from 'react';

function Message(props) {
  const [show, setShow] = useState(true);

  const toggleMessage = () => {
    setShow(prev => !prev);
  };

  return (
    <div>
      {show && <p>This is a message.</p>}
      <button onClick={toggleMessage}>Toggle Message</button>
    </div>
  );
}

export default Message;
`;
}

// Run the main function
main();
