// ========================================
// CERTI-BATCH - MAIN SCRIPT
// Enhanced with Security & Dynamic Column Mapping
// ========================================

// Global State
const state = {
    templateImage: null,
    csvData: [],
    csvHeaders: [],
    selectedColumn: '',
    textPosition: { x: 0, y: 0 },
    isDragging: false,
    dragOffset: { x: 0, y: 0 },
    fontSizeScaleFactor: 0.01  // Font size as fraction of canvas width
};

// DOM Elements
const elements = {
    templateInput: document.getElementById('templateInput'),
    templateZone: document.getElementById('templateZone'),
    templateSelected: document.getElementById('templateSelected'),
    templateFileName: document.getElementById('templateFileName'),

    csvInput: document.getElementById('csvInput'),
    csvZone: document.getElementById('csvZone'),
    csvSelected: document.getElementById('csvSelected'),
    csvFileName: document.getElementById('csvFileName'),

    sampleText: document.getElementById('sampleText'),
    nameColumn: document.getElementById('nameColumn'),
    columnSelectorGroup: document.getElementById('columnSelectorGroup'),
    fontSize: document.getElementById('fontSize'),
    textColor: document.getElementById('textColor'),
    fontStyle: document.getElementById('fontStyle'),
    colorValue: document.getElementById('colorValue'),

    generateBtn: document.getElementById('generateBtn'),
    canvas: document.getElementById('previewCanvas'),
    draggableText: document.getElementById('draggableText'),
    canvasContainer: document.getElementById('canvasContainer'),
    canvasPlaceholder: document.getElementById('canvasPlaceholder'),
    positionDisplay: document.getElementById('positionDisplay'),
    progressContainer: document.getElementById('progressContainer'),
    progressBar: document.getElementById('progressBar'),
    progressText: document.getElementById('progressText')
};

const ctx = elements.canvas.getContext('2d');

// ========================================
// INITIALIZATION
// ========================================
function init() {
    setupEventListeners();
    setupFileZones();
}

// ========================================
// EVENT LISTENERS
// ========================================
function setupEventListeners() {
    // Text controls
    elements.sampleText.addEventListener('input', updateDraggableText);
    elements.fontSize.addEventListener('input', updateDraggableText);
    elements.textColor.addEventListener('input', handleColorChange);
    elements.fontStyle.addEventListener('change', updateDraggableText);
    elements.nameColumn.addEventListener('change', handleColumnChange);

    // Drag and drop for text positioning
    elements.draggableText.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', endDrag);

    // Generate button
    elements.generateBtn.addEventListener('click', generateBatch);
}

// ========================================
// FILE UPLOAD ZONES
// ========================================
function setupFileZones() {
    // Template zone
    elements.templateZone.addEventListener('click', () => {
        elements.templateInput.click();
    });

    elements.templateInput.addEventListener('change', handleTemplateUpload);

    // CSV zone
    elements.csvZone.addEventListener('click', () => {
        elements.csvInput.click();
    });

    elements.csvInput.addEventListener('change', handleCSVUpload);

    // Drag and drop for template
    setupDragAndDrop(elements.templateZone, elements.templateInput);

    // Drag and drop for CSV
    setupDragAndDrop(elements.csvZone, elements.csvInput);
}

function setupDragAndDrop(zone, input) {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.borderColor = 'var(--primary)';
        zone.style.background = 'var(--primary-light)';
    });

    zone.addEventListener('dragleave', () => {
        zone.style.borderColor = '';
        zone.style.background = '';
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.borderColor = '';
        zone.style.background = '';

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            input.files = files;
            input.dispatchEvent(new Event('change'));
        }
    });
}

// ========================================
// TEMPLATE IMAGE HANDLING
// ========================================
function handleTemplateUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (event) {
        const img = new Image();
        img.onload = function () {
            state.templateImage = img;

            // Calculate preview canvas size (scale down if needed for display)
            const maxPreviewWidth = 800; // Maximum preview width
            const nativeWidth = img.naturalWidth;
            const nativeHeight = img.naturalHeight;

            let previewWidth, previewHeight;
            if (nativeWidth > maxPreviewWidth) {
                // Scale down for preview
                const scale = maxPreviewWidth / nativeWidth;
                previewWidth = maxPreviewWidth;
                previewHeight = Math.round(nativeHeight * scale);
            } else {
                // Use native size if smaller than max
                previewWidth = nativeWidth;
                previewHeight = nativeHeight;
            }

            // Set preview canvas size (for display)
            elements.canvas.width = previewWidth;
            elements.canvas.height = previewHeight;

            // Draw template on preview canvas (scaled down)
            ctx.drawImage(img, 0, 0, previewWidth, previewHeight);

            // Hide placeholder, show canvas and draggable text
            elements.canvasPlaceholder.style.display = 'none';
            elements.canvas.style.display = 'block';
            elements.draggableText.style.display = 'block';

            // Initialize text position at center
            const containerRect = elements.canvasContainer.getBoundingClientRect();
            state.textPosition.x = containerRect.width / 2 - 100;
            state.textPosition.y = containerRect.height / 2;
            updateDraggableTextPosition();

            // Update UI
            elements.templateZone.classList.add('has-file');
            elements.templateZone.querySelector('.upload-content').style.display = 'none';
            elements.templateSelected.style.display = 'flex';
            elements.templateFileName.textContent = file.name;

            // Initialize font scaling factor with current font size
            updateDraggableText();

            // Log dimensions for debugging
            console.log('Native Image:', nativeWidth, 'x', nativeHeight);
            console.log('Preview Canvas:', previewWidth, 'x', previewHeight);
            console.log('Scale Factor:', nativeWidth / previewWidth);

            checkReadyToGenerate();
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

// ========================================
// CSV HANDLING WITH DYNAMIC COLUMN MAPPING
// ========================================
function handleCSVUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
            state.csvData = results.data;

            // Extract headers from the first row
            if (results.meta && results.meta.fields) {
                state.csvHeaders = results.meta.fields;
                populateColumnSelector(state.csvHeaders);
            }

            // Update UI
            elements.csvZone.classList.add('has-file');
            elements.csvZone.querySelector('.upload-content').style.display = 'none';
            elements.csvSelected.style.display = 'flex';
            elements.csvFileName.textContent = `${file.name} (${state.csvData.length} names)`;

            // Show column selector
            elements.columnSelectorGroup.style.display = 'block';

            checkReadyToGenerate();
        },
        error: function (error) {
            alert('Error parsing CSV: ' + error.message);
        }
    });
}

// ========================================
// DYNAMIC COLUMN SELECTOR
// ========================================
function populateColumnSelector(headers) {
    // Clear existing options except the first placeholder
    elements.nameColumn.innerHTML = '<option value="">Select column...</option>';

    // Add all headers as options
    headers.forEach(header => {
        const option = document.createElement('option');
        option.value = header;
        option.textContent = header;
        elements.nameColumn.appendChild(option);
    });

    // Auto-select logic: look for "name", "nama", or "full" (case-insensitive)
    const autoSelectColumn = headers.find(header => {
        const lowerHeader = header.toLowerCase();
        return lowerHeader.includes('name') ||
            lowerHeader.includes('nama') ||
            lowerHeader.includes('full');
    });

    if (autoSelectColumn) {
        elements.nameColumn.value = autoSelectColumn;
        state.selectedColumn = autoSelectColumn;
    } else {
        // Default to first column if no match
        elements.nameColumn.value = headers[0];
        state.selectedColumn = headers[0];
    }
}

function handleColumnChange(e) {
    state.selectedColumn = e.target.value;
    checkReadyToGenerate();
}

// ========================================
// DRAGGABLE TEXT CONTROLS
// ========================================
function updateDraggableText() {
    const text = elements.sampleText.value || 'NAMA PESERTA';
    const fontSizeInput = parseInt(elements.fontSize.value);
    const color = elements.textColor.value;
    const fontFamily = elements.fontStyle.value;

    // Calculate font size scaling factor based on preview canvas width
    if (elements.canvas.width > 0) {
        state.fontSizeScaleFactor = fontSizeInput / elements.canvas.width;
    }

    // Apply font size to draggable text (for preview)
    const previewFontSize = fontSizeInput + 'px';
    elements.draggableText.textContent = text;
    elements.draggableText.style.fontSize = previewFontSize;
    elements.draggableText.style.color = color;
    elements.draggableText.style.fontFamily = fontFamily;
}

function handleColorChange(e) {
    elements.colorValue.textContent = e.target.value.toUpperCase();
    updateDraggableText();
}

function updateDraggableTextPosition() {
    elements.draggableText.style.left = state.textPosition.x + 'px';
    elements.draggableText.style.top = state.textPosition.y + 'px';

    // Calculate CENTER coordinates for display (used in generation)
    const textRect = elements.draggableText.getBoundingClientRect();
    const centerX = state.textPosition.x + (textRect.width / 2);
    const centerY = state.textPosition.y + (textRect.height / 2);

    elements.positionDisplay.textContent = `Position: X: ${Math.round(centerX)}, Y: ${Math.round(centerY)}`;
}

// ========================================
// DRAG AND DROP FUNCTIONALITY
// ========================================
function startDrag(e) {
    state.isDragging = true;
    elements.draggableText.classList.add('dragging');

    const rect = elements.draggableText.getBoundingClientRect();
    state.dragOffset.x = e.clientX - rect.left;
    state.dragOffset.y = e.clientY - rect.top;

    e.preventDefault();
}

function drag(e) {
    if (!state.isDragging) return;

    const containerRect = elements.canvasContainer.getBoundingClientRect();

    let newX = e.clientX - containerRect.left - state.dragOffset.x;
    let newY = e.clientY - containerRect.top - state.dragOffset.y;

    // Keep within bounds
    newX = Math.max(0, Math.min(newX, containerRect.width - 200));
    newY = Math.max(0, Math.min(newY, containerRect.height - 50));

    state.textPosition.x = newX;
    state.textPosition.y = newY;

    updateDraggableTextPosition();
}

function endDrag() {
    if (state.isDragging) {
        state.isDragging = false;
        elements.draggableText.classList.remove('dragging');
    }
}

// ========================================
// STRICT FILENAME SANITIZATION
// ========================================
function sanitizeFilename(name) {
    // Remove all characters except alphanumeric and spaces
    let cleaned = name.replace(/[^a-zA-Z0-9\s]/g, '');

    // Replace spaces with underscores
    cleaned = cleaned.replace(/\s+/g, '_');

    // Convert to lowercase
    cleaned = cleaned.toLowerCase();

    // Limit length to prevent path issues
    if (cleaned.length > 50) {
        cleaned = cleaned.substring(0, 50);
    }

    // Ensure it's not empty
    if (!cleaned) {
        cleaned = 'certificate';
    }

    return cleaned;
}

// ========================================
// UPDATE PROGRESS BAR
// ========================================
function updateProgress(current, total, message) {
    const percentage = Math.round((current / total) * 100);
    elements.progressBar.style.width = percentage + '%';
    elements.progressText.textContent = `${message} (${current}/${total} - ${percentage}%)`;
}

// ========================================
// BATCH GENERATION WITH DYNAMIC COLUMN
// ========================================
async function generateBatch() {
    if (!state.templateImage || state.csvData.length === 0) {
        alert('Please upload both template and CSV data!');
        return;
    }

    if (!state.selectedColumn) {
        alert('Please select a name column from the dropdown!');
        return;
    }

    elements.generateBtn.disabled = true;
    elements.progressContainer.style.display = 'block';
    updateProgress(0, state.csvData.length, 'Initializing');

    const zip = new JSZip();
    const fontSize = parseInt(elements.fontSize.value);
    const fontFamily = elements.fontStyle.value;
    const textColor = elements.textColor.value;

    // CALCULATE SCALE FACTOR USING VISUAL DIMENSIONS (getBoundingClientRect)
    const nativeWidth = state.templateImage.naturalWidth;
    const nativeHeight = state.templateImage.naturalHeight;

    // Use visual bounding rect for accurate scaling (accounts for CSS)
    const canvasRect = elements.canvas.getBoundingClientRect();
    const previewVisualWidth = canvasRect.width;
    const previewVisualHeight = canvasRect.height;

    // THE GOLDEN RATIO: Native vs Visual
    const scaleFactor = nativeWidth / previewVisualWidth;

    console.log('=== PRECISE SCALE FACTOR CALCULATION ===');
    console.log('Native Dimensions:', nativeWidth, 'x', nativeHeight);
    console.log('Visual Preview (getBoundingClientRect):', previewVisualWidth, 'x', previewVisualHeight);
    console.log('Scale Factor:', scaleFactor);
    console.log('User Font Size:', fontSize);
    console.log('Final Font Size:', Math.round(fontSize * scaleFactor));

    // Calculate CENTER coordinates from draggable text position
    const textRect = elements.draggableText.getBoundingClientRect();
    const containerRect = elements.canvasContainer.getBoundingClientRect();

    // Get center of draggable text relative to canvas
    const textCenterX = textRect.left + (textRect.width / 2) - canvasRect.left;
    const textCenterY = textRect.top + (textRect.height / 2) - canvasRect.top;

    console.log('Text Center on Preview Canvas:', textCenterX, 'x', textCenterY);

    // PERFORMANCE: Create ONE reusable canvas (don't recreate each iteration)
    const finalCanvas = document.createElement('canvas');
    finalCanvas.width = nativeWidth;
    finalCanvas.height = nativeHeight;
    const fCtx = finalCanvas.getContext('2d');

    // Process each name from CSV using selected column
    for (let i = 0; i < state.csvData.length; i++) {
        const record = state.csvData[i];

        // Get name from the selected column
        const name = record[state.selectedColumn];

        if (!name) {
            console.warn(`Row ${i + 1}: No value in column "${state.selectedColumn}"`);
            continue;
        }

        // Update progress BEFORE processing (so UI updates)
        updateProgress(i + 1, state.csvData.length, 'Processing');

        // PERFORMANCE: Allow UI to breathe (longer delay for high-res images)
        await sleep(100);

        // PERFORMANCE: Clear canvas instead of creating new one
        fCtx.clearRect(0, 0, nativeWidth, nativeHeight);

        // 1. Draw the high-res template at native resolution
        fCtx.drawImage(state.templateImage, 0, 0, nativeWidth, nativeHeight);

        // 2. Calculate SCALED font size and CENTER coordinates
        const finalFontSize = Math.round(fontSize * scaleFactor);
        const finalX = textCenterX * scaleFactor;
        const finalY = textCenterY * scaleFactor;

        // 3. CRITICAL: Set anchor point to CENTER + MIDDLE for perfect alignment
        fCtx.textAlign = 'center';
        fCtx.textBaseline = 'middle';
        fCtx.font = `${finalFontSize}px ${fontFamily}`;
        fCtx.fillStyle = textColor;

        // 4. Draw the text at SCALED CENTER coordinates
        fCtx.fillText(name, finalX, finalY);

        // PERFORMANCE: Convert to blob (memory-efficient, not base64)
        const blob = await new Promise(resolve => {
            finalCanvas.toBlob(resolve, 'image/png', 1.0);
        });

        // Strict filename sanitization
        const sanitizedName = sanitizeFilename(name);
        const filename = `cert_${String(i + 1).padStart(3, '0')}_${sanitizedName}.png`;

        // Add to ZIP
        zip.file(filename, blob);

        console.log(`✓ Certificate ${i + 1}/${state.csvData.length} added`);
    }

    // Generate and download ZIP with STREAMING for memory efficiency
    elements.progressText.textContent = 'Creating ZIP file...';

    try {
        // PERFORMANCE: Use streamFiles to reduce peak memory
        const content = await zip.generateAsync({
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: {
                level: 6
            },
            streamFiles: true  // CRITICAL: Prevents memory exhaustion
        });

        // Use FileSaver.js for safer download
        const timestamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0];
        const zipFilename = `certificates_${timestamp}.zip`;
        saveAs(content, zipFilename);

        // Success feedback
        elements.progressBar.style.width = '100%';
        elements.progressText.textContent = `✓ Success! ${state.csvData.length} certificates generated`;

        setTimeout(() => {
            elements.progressContainer.style.display = 'none';
            elements.progressBar.style.width = '0%';
            elements.generateBtn.disabled = false;
        }, 3000);

    } catch (error) {
        alert('Error generating ZIP: ' + error.message);
        elements.progressContainer.style.display = 'none';
        elements.generateBtn.disabled = false;
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function checkReadyToGenerate() {
    if (state.templateImage && state.csvData.length > 0 && state.selectedColumn) {
        elements.generateBtn.disabled = false;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ========================================
// START APPLICATION
// ========================================
init();
