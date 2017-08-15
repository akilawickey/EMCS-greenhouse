filename = 'C:\Users\danny\Documents\MATLAB\Greenhouse - Temp.csv';
delimiter = ',';
formatSpec = '%*s%*s%*s%f%[^\n\r]';
fileID = fopen(filename,'r');
dataArray = textscan(fileID, formatSpec, 'Delimiter', delimiter, 'EmptyValue' ,NaN, 'ReturnOnError', false);
fclose(fileID);

temp_vector = dataArray{:, 1};
% temp_vector =  temp_vector(isfinite(temp_vector(:, 1)), :)
temp_vector(isnan(temp_vector)) = 0 ;
temp_vector = transpose(temp_vector);

clearvars filename delimiter formatSpec fileID dataArray ans;
filename = 'C:\Users\danny\Documents\MATLAB\Greenhouse - Temp.csv';
delimiter = ',';
formatSpec = '%*s%*s%*s%*s%f%f%[^\n\r]';
fileID = fopen(filename,'r');
dataArray = textscan(fileID, formatSpec, 'Delimiter', delimiter, 'EmptyValue' ,NaN, 'ReturnOnError', false);
fclose(fileID);

actuators = [dataArray{1:end-1}];
actuators = transpose(actuators);

clearvars filename delimiter formatSpec fileID dataArray ans;

net = patternnet(200,'trainlm');

% Show training progress every 50 epochs
net.trainParam.show = 50;
% Set learning rate to 0.5
net.trainParam.lr = 0.1;
% Set error goal to 0.01
net.trainparam.goal = 1e-2;

net.trainParam.epochs = 10000;

% Fisher = reshape(Fisher,145,5);
net = train(net, temp_vector, actuators);
x = linspace(25,0.1,28);
a1 = sim(net,x);
disp(a1)
